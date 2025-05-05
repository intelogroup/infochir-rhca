
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { 
  generateSubmissionHtmlContent,
  generateSubmissionTextContent
} from "../_shared/email-templates.ts";
import { 
  sendEmail,
  sendBackupEmail,
  checkResendApiKey
} from "../_shared/email-sender.ts";
import { 
  logError,
  createErrorResponse,
  createSuccessResponse
} from "../_shared/error-logger.ts";

// Email notification recipient - updated to the specified email
const NOTIFICATION_EMAIL = "jimkalinov@gmail.com";

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }
  
  try {
    // Verify API key is valid before attempting to send
    const apiKeyCheck = await checkResendApiKey();
    if (!apiKeyCheck.valid) {
      logError("[notify-submission] Invalid or missing Resend API key", new Error(apiKeyCheck.message));
      return createErrorResponse(
        "Email configuration error: " + apiKeyCheck.message, 
        500, 
        corsHeaders
      );
    }
    
    // Get the submission data
    const submissionData = await req.json();
    
    console.log("[notify-submission] Received data for notification:", {
      title: submissionData.title,
      type: submissionData.publication_type,
      author: submissionData.corresponding_author_name
    });
    
    // Format the submission date for the email
    const formattedDate = new Date().toLocaleString('fr-FR', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Generate email content
    const htmlContent = generateSubmissionHtmlContent(submissionData, formattedDate);
    const textContent = generateSubmissionTextContent(submissionData, formattedDate);

    try {
      // Send the email notification
      const emailResult = await sendEmail(
        NOTIFICATION_EMAIL,
        `Nouvelle soumission d'article: ${submissionData.title}`,
        htmlContent,
        textContent,
        submissionData.corresponding_author_email
      );
      
      if (emailResult.success) {
        console.log("[notify-submission] Email sent successfully");
        return createSuccessResponse({ 
          success: true,
          message: "Email notification sent successfully",
          service_response: emailResult.data
        }, 200, corsHeaders);
      }
      
      // Try backup method if primary method fails
      console.log("[notify-submission] Primary email method failed, trying backup method");
      const backupResult = await sendBackupEmail(
        NOTIFICATION_EMAIL,
        `Nouvelle soumission - ${submissionData.title}`,
        textContent
      );
      
      if (backupResult.success) {
        console.log("[notify-submission] Backup email sent successfully");
        return createSuccessResponse({ 
          success: true,
          message: "Email notification sent via backup method",
          service_response: backupResult.data
        }, 200, corsHeaders);
      }
      
      // If both methods fail, return error
      throw emailResult.error || backupResult.error || new Error("Both email methods failed");
      
    } catch (emailErr) {
      logError("[notify-submission] Error sending email notification", emailErr);
      return createErrorResponse(
        "Failed to send email notification", 
        500, 
        corsHeaders, 
        emailErr
      );
    }
  } catch (err) {
    logError("[notify-submission] Error in notify-submission function", err);
    return createErrorResponse(
      err.message || 'Internal server error', 
      500, 
      corsHeaders, 
      err
    );
  }
});
