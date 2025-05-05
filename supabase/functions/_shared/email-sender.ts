
/**
 * Email sending functionality using Resend API
 */
import { Resend } from "npm:resend@2.0.0";
import { logError } from "./error-logger.ts";

// Initialize Resend email client with the environment variable
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    
    // Send email using Resend with verified domain
    const emailResponse = await resend.emails.send({
      from: "InfoChir <submissions@info-chir.org>",
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
    
    // Implement a simpler backup method with fewer headers and options
    const backupEmailResponse = await resend.emails.send({
      from: "InfoChir <no-reply@info-chir.org>",
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
