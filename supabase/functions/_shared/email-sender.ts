
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

// Lazy initialization of Resend client to avoid unnecessary instantiation
const getResendClient = () => {
  if (!resend && RESEND_API_KEY) {
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
  // Check cache first
  const now = Date.now();
  if (apiKeyValidationCache.timestamp > 0 && 
      now - apiKeyValidationCache.timestamp < CACHE_TTL) {
    console.log("[email-sender] Using cached API key validation result");
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
    apiKeyValidationCache = {...result, timestamp: now};
    return result;
  }
  
  // Simple validation - just check that it follows the basic format of Resend API keys
  if (!RESEND_API_KEY.startsWith('re_')) {
    const result = { 
      valid: false, 
      message: "Resend API key appears to be invalid. Keys should start with 're_'." 
    };
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
    
    // Handle rate limiting explicitly
    if (domainsResponse.status === 429) {
      console.log("[email-sender] API key validation rate limited by Resend API");
      
      // If rate limited but we've validated successfully before, use the last success
      if (apiKeyValidationCache.valid) {
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
      const errorData = await domainsResponse.json();
      const result = { 
        valid: false, 
        message: `API key validation failed: ${errorData.message || domainsResponse.statusText}` 
      };
      apiKeyValidationCache = {...result, timestamp: now};
      return result;
    }
    
    const result = { valid: true, message: "API key validated successfully" };
    apiKeyValidationCache = {...result, timestamp: now};
    return result;
  } catch (error) {
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
 * Send an email notification using Resend
 * @param recipient Email address of the recipient
 * @param subject Email subject
 * @param html HTML content of the email
 * @param text Plain text content of the email
 * @param replyTo Optional reply-to email address
 * @returns Object with success status and response data
 */
export async function sendEmail(
  recipient: string, 
  subject: string, 
  html: string, 
  text: string, 
  replyTo?: string
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    console.log("[email-sender] Attempting to send email notification using Resend...");
    console.log("[email-sender] Recipient:", recipient);
    
    const client = getResendClient();
    if (!client) {
      throw new Error("Resend API key is not configured");
    }
    
    // Send email using Resend with their default sender domain
    // This avoids the need for domain verification
    const emailResponse = await client.emails.send({
      from: "InfoChir <onboarding@resend.dev>",
      to: [recipient],
      subject: subject,
      html: html,
      text: text,
      ...(replyTo && { reply_to: replyTo })
    });
    
    console.log("[email-sender] Email service response:", emailResponse);
    
    if (emailResponse.error) {
      throw new Error(`Email API responded with error: ${JSON.stringify(emailResponse.error)}`);
    }
    
    console.log("[email-sender] Email notification sent successfully");
    
    return {
      success: true,
      data: emailResponse
    };
  } catch (emailErr) {
    logError("[email-sender] Exception while sending email", emailErr);
    return {
      success: false,
      error: emailErr
    };
  }
}

/**
 * Attempt to send a simplified backup email when the main email fails
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
    console.log("[email-sender] Attempting backup email method...");
    
    const client = getResendClient();
    if (!client) {
      throw new Error("Resend API key is not configured");
    }
    
    // Implement a simpler backup method with fewer headers and options
    // Using Resend's default sender domain
    const backupEmailResponse = await client.emails.send({
      from: "InfoChir Backup <onboarding@resend.dev>",
      to: [recipient],
      subject: `BACKUP: ${subject}`,
      text: text,
    });
    
    console.log("[email-sender] Backup email response:", backupEmailResponse);
    
    if (backupEmailResponse.error) {
      throw new Error(`Backup email also failed with error: ${JSON.stringify(backupEmailResponse.error)}`);
    }
    
    return {
      success: true,
      data: backupEmailResponse
    };
  } catch (backupErr) {
    logError("[email-sender] Backup email method also failed", backupErr);
    return {
      success: false,
      error: backupErr
    };
  }
}
