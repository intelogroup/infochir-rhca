/**
 * Email sending functionality using Resend API
 */
import { Resend } from "npm:resend@2.0.0";
import { logError } from "./error-logger.ts";

// Initialize Resend email client with the environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
let resend: Resend | null = null;

// Cache for API key validation to prevent repeated checks
let apiKeyValidationCache = {
  valid: false,
  message: "",
  timestamp: 0
};
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

// Updated sender configuration to use verified domain
const DEFAULT_SENDER = "InfoChir <noreply@info-chir.org>";
const DEFAULT_BACKUP_SENDER = "InfoChir Backup <noreply@info-chir.org>";

// Email attachment interface
export interface EmailAttachment {
  filename: string;
  content: string; // base64 encoded content
  content_type?: string;
  size?: number;
}

// Constants for attachment limits
const MAX_ATTACHMENT_SIZE = 40 * 1024 * 1024; // 40MB Resend limit
const MAX_TOTAL_SIZE = 45 * 1024 * 1024; // 45MB total including email content
const MAX_ATTACHMENTS = 10; // Reasonable limit

// Lazy initialization of Resend client to avoid unnecessary instantiation
const getResendClient = () => {
  if (!resend && RESEND_API_KEY) {
    console.log("[email-sender] Initializing Resend client");
    resend = new Resend(RESEND_API_KEY);
  }
  return resend;
};

/**
 * Check if the Resend API key is valid and properly configured
 * Uses cache to avoid repeated API calls and prevent rate limiting
 * @returns Object with validation status and message
 */
export async function checkResendApiKey(): Promise<{ valid: boolean; message: string }> {
  console.log("[email-sender] Checking Resend API key validity");
  
  // Check cache first
  const now = Date.now();
  if (apiKeyValidationCache.timestamp > 0 && 
      now - apiKeyValidationCache.timestamp < CACHE_TTL) {
    console.log("[email-sender] Using cached API key validation result:", apiKeyValidationCache.valid);
    return { 
      valid: apiKeyValidationCache.valid, 
      message: apiKeyValidationCache.message 
    };
  }
  
  if (!RESEND_API_KEY) {
    const result = { 
      valid: false, 
      message: "Resend API key is not configured. Please add the RESEND_API_KEY secret in Supabase." 
    };
    console.error("[email-sender] No API key found");
    apiKeyValidationCache = {...result, timestamp: now};
    return result;
  }
  
  console.log("[email-sender] API key found, checking format");
  
  // Simple validation - just check that it follows the basic format of Resend API keys
  if (!RESEND_API_KEY.startsWith('re_')) {
    const result = { 
      valid: false, 
      message: "Resend API key appears to be invalid. Keys should start with 're_'." 
    };
    console.error("[email-sender] API key format invalid");
    apiKeyValidationCache = {...result, timestamp: now};
    return result;
  }
  
  // Try a simple API call to verify the key works, with rate limit awareness
  try {
    console.log("[email-sender] Testing API key validity with Resend API");
    
    // We'll just get domains to verify the API key works
    const domainsResponse = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
    });
    
    console.log("[email-sender] Domains API response status:", domainsResponse.status);
    
    // Handle rate limiting explicitly
    if (domainsResponse.status === 429) {
      console.log("[email-sender] API key validation rate limited by Resend API");
      
      // If rate limited but we've validated successfully before, use the last success
      if (apiKeyValidationCache.valid) {
        console.log("[email-sender] Using previous validation result due to rate limiting");
        return { 
          valid: true, 
          message: "API key previously validated successfully (using cached result due to rate limiting)" 
        };
      }
      
      // Otherwise report the rate limiting
      const result = { 
        valid: false, 
        message: "API key validation rate limited. Please try again later." 
      };
      return result;
    }
    
    if (!domainsResponse.ok) {
      const errorData = await domainsResponse.json().catch(() => ({ message: 'Unknown error' }));
      console.error("[email-sender] API key validation failed:", errorData);
      const result = { 
        valid: false, 
        message: `API key validation failed: ${errorData.message || domainsResponse.statusText}` 
      };
      apiKeyValidationCache = {...result, timestamp: now};
      return result;
    }
    
    console.log("[email-sender] API key validation successful");
    const result = { valid: true, message: "API key validated successfully" };
    apiKeyValidationCache = {...result, timestamp: now};
    return result;
  } catch (error) {
    console.error("[email-sender] Error validating API key:", error);
    const result = { 
      valid: false, 
      message: `Error validating API key: ${error instanceof Error ? error.message : String(error)}` 
    };
    return result;
  }
}

/**
 * A utility function to check if a domain is verified in Resend
 * This is useful to validate domain setup before sending emails
 * @param domain The domain to check (e.g., 'info-chir.org')
 * @returns Object with success status and domain status
 */
export async function checkDomainVerification(
  domain: string
): Promise<{ success: boolean; verified: boolean; message: string }> {
  try {
    console.log("[email-sender] Checking domain verification status for:", domain);
    
    if (!RESEND_API_KEY) {
      return {
        success: false,
        verified: false,
        message: "Resend API key is not configured"
      };
    }
    
    const client = getResendClient();
    if (!client) {
      return {
        success: false,
        verified: false,
        message: "Failed to initialize Resend client"
      };
    }
    
    const domainsResponse = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
    });
    
    // Handle rate limiting explicitly
    if (domainsResponse.status === 429) {
      console.log("[email-sender] Domain verification check rate limited by Resend API");
      return {
        success: true,
        verified: false, // Assume not verified to be safe
        message: "Domain verification check rate limited. Please try again later."
      };
    }
    
    if (!domainsResponse.ok) {
      return {
        success: false,
        verified: false,
        message: `Failed to fetch domains: ${domainsResponse.statusText}`
      };
    }
    
    const domainsData = await domainsResponse.json();
    const domainInfo = domainsData.data?.find((d: any) => d.name === domain);
    
    if (!domainInfo) {
      return {
        success: true,
        verified: false,
        message: `Domain ${domain} not found in your Resend account`
      };
    }
    
    return {
      success: true,
      verified: domainInfo.status === 'verified',
      message: domainInfo.status === 'verified' 
        ? `Domain ${domain} is verified` 
        : `Domain ${domain} is not verified (status: ${domainInfo.status})`
    };
  } catch (error) {
    logError("[email-sender] Error checking domain verification", error);
    return {
      success: false,
      verified: false,
      message: `Error checking domain: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Validate attachments before sending
 * @param attachments Array of email attachments
 * @returns Object with validation status and message
 */
export function validateAttachments(attachments: EmailAttachment[]): { valid: boolean; message: string } {
  if (!attachments || attachments.length === 0) {
    return { valid: true, message: "No attachments to validate" };
  }

  if (attachments.length > MAX_ATTACHMENTS) {
    return { 
      valid: false, 
      message: `Too many attachments. Maximum ${MAX_ATTACHMENTS} allowed, got ${attachments.length}` 
    };
  }

  let totalSize = 0;
  for (const attachment of attachments) {
    if (!attachment.filename || !attachment.content) {
      return { 
        valid: false, 
        message: `Invalid attachment: missing filename or content` 
      };
    }

    // Calculate base64 decoded size (approximate)
    const contentSize = Math.floor(attachment.content.length * 0.75);
    
    if (contentSize > MAX_ATTACHMENT_SIZE) {
      return { 
        valid: false, 
        message: `Attachment "${attachment.filename}" is too large (${Math.round(contentSize / 1024 / 1024)}MB). Maximum ${Math.round(MAX_ATTACHMENT_SIZE / 1024 / 1024)}MB per file.` 
      };
    }

    totalSize += contentSize;
  }

  if (totalSize > MAX_TOTAL_SIZE) {
    return { 
      valid: false, 
      message: `Total attachment size too large (${Math.round(totalSize / 1024 / 1024)}MB). Maximum ${Math.round(MAX_TOTAL_SIZE / 1024 / 1024)}MB total.` 
    };
  }

  return { valid: true, message: "Attachments validated successfully" };
}

/**
 * Send an email notification using Resend with optional attachments
 * @param recipient Email address of the recipient
 * @param subject Email subject
 * @param html HTML content of the email
 * @param text Plain text content of the email
 * @param replyTo Optional reply-to email address
 * @param attachments Optional array of email attachments
 * @returns Object with success status and response data
 */
export async function sendEmail(
  recipient: string, 
  subject: string, 
  html: string, 
  text: string, 
  replyTo?: string,
  attachments?: EmailAttachment[]
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    console.log("[email-sender] === SENDING EMAIL ===");
    console.log("- To:", recipient);
    console.log("- Subject:", subject);
    console.log("- HTML length:", html.length);
    console.log("- Text length:", text.length);
    console.log("- Reply-to:", replyTo || "none");
    console.log("- Attachments:", attachments ? attachments.length : 0);
    
    const client = getResendClient();
    if (!client) {
      const error = new Error("Resend API key is not configured");
      console.error("[email-sender] No Resend client available");
      throw error;
    }
    
    // Validate attachments if provided
    if (attachments && attachments.length > 0) {
      const validation = validateAttachments(attachments);
      if (!validation.valid) {
        console.error("[email-sender] Attachment validation failed:", validation.message);
        throw new Error(`Attachment validation failed: ${validation.message}`);
      }
      console.log("[email-sender] Attachments validated successfully");
    }
    
    // Prepare email payload with attachments
    const emailPayload: any = {
      from: DEFAULT_SENDER,
      to: [recipient],
      subject: subject,
      html: html,
      text: text,
      ...(replyTo && { reply_to: replyTo })
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      emailPayload.attachments = attachments.map(att => ({
        filename: att.filename,
        content: att.content,
        content_type: att.content_type || 'application/octet-stream'
      }));
      console.log("[email-sender] Added", attachments.length, "attachments to email");
    }
    
    console.log("[email-sender] Email payload prepared:", {
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      hasHtml: !!emailPayload.html,
      hasText: !!emailPayload.text,
      hasReplyTo: !!emailPayload.reply_to,
      attachmentCount: emailPayload.attachments ? emailPayload.attachments.length : 0
    });
    
    // Send email using Resend with their default sender domain
    console.log("[email-sender] Calling Resend API...");
    const emailResponse = await client.emails.send(emailPayload);
    
    console.log("[email-sender] Resend API response:", {
      hasData: !!emailResponse.data,
      hasError: !!emailResponse.error,
      dataId: emailResponse.data?.id,
      errorMessage: emailResponse.error?.message
    });
    
    if (emailResponse.error) {
      console.error("[email-sender] Resend API returned error:", emailResponse.error);
      throw new Error(`Email API responded with error: ${JSON.stringify(emailResponse.error)}`);
    }
    
    console.log("[email-sender] ✅ Email sent successfully");
    console.log("- Email ID:", emailResponse.data?.id);
    
    return {
      success: true,
      data: emailResponse.data
    };
  } catch (emailErr) {
    console.error("[email-sender] ❌ Email sending failed:", emailErr);
    console.error("[email-sender] Error details:", {
      message: emailErr.message,
      stack: emailErr.stack
    });
    logError("[email-sender] Exception while sending email", emailErr);
    return {
      success: false,
      error: emailErr
    };
  }
}

/**
 * Attempt to send a simplified backup email when the main email fails
 * Note: Backup emails do not support attachments
 * @param recipient Email address of the recipient
 * @param subject Email subject (will be prefixed with "BACKUP:")
 * @param text Plain text content of the email
 * @returns Object with success status and response data
 */
export async function sendBackupEmail(
  recipient: string, 
  subject: string, 
  text: string
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    console.log("[email-sender] === SENDING BACKUP EMAIL ===");
    console.log("- To:", recipient);
    console.log("- Subject: BACKUP:", subject);
    console.log("- Text length:", text.length);
    console.log("- Note: Backup emails do not support attachments");
    
    const client = getResendClient();
    if (!client) {
      const error = new Error("Resend API key is not configured");
      console.error("[email-sender] No Resend client available for backup");
      throw error;
    }
    
    // Implement a simpler backup method with fewer headers and options
    const backupPayload = {
      from: DEFAULT_BACKUP_SENDER,
      to: [recipient],
      subject: `BACKUP: ${subject}`,
      text: text,
    };
    
    console.log("[email-sender] Backup payload prepared:", {
      from: backupPayload.from,
      to: backupPayload.to,
      subject: backupPayload.subject
    });
    
    console.log("[email-sender] Calling Resend API for backup...");
    const backupEmailResponse = await client.emails.send(backupPayload);
    
    console.log("[email-sender] Backup email response:", {
      hasData: !!backupEmailResponse.data,
      hasError: !!backupEmailResponse.error,
      dataId: backupEmailResponse.data?.id,
      errorMessage: backupEmailResponse.error?.message
    });
    
    if (backupEmailResponse.error) {
      console.error("[email-sender] Backup email failed:", backupEmailResponse.error);
      throw new Error(`Backup email also failed with error: ${JSON.stringify(backupEmailResponse.error)}`);
    }
    
    console.log("[email-sender] ✅ Backup email sent successfully");
    console.log("- Backup email ID:", backupEmailResponse.data?.id);
    
    return {
      success: true,
      data: backupEmailResponse.data
    };
  } catch (backupErr) {
    console.error("[email-sender] ❌ Backup email method failed:", backupErr);
    logError("[email-sender] Backup email method also failed", backupErr);
    return {
      success: false,
      error: backupErr
    };
  }
}
