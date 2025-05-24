
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { 
  generateSubmissionHtmlContent,
  generateSubmissionTextContent,
  generateUserConfirmationHtmlContent,
  generateUserConfirmationTextContent
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
      author: submissionData.corresponding_author_name,
      email: submissionData.corresponding_author_email
    });
    
    // Format the submission date for the email
    const formattedDate = new Date().toLocaleString('fr-FR', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Generate admin notification email content
    const adminHtmlContent = generateSubmissionHtmlContent(submissionData, formattedDate);
    const adminTextContent = generateSubmissionTextContent(submissionData, formattedDate);

    // Generate user confirmation email content
    const userHtmlContent = generateUserConfirmationHtmlContent(submissionData, formattedDate);
    const userTextContent = generateUserConfirmationTextContent(submissionData, formattedDate);

    const emailResults = [];

    try {
      // Send admin notification email
      console.log("[notify-submission] Sending admin notification email");
      const adminEmailResult = await sendEmail(
        NOTIFICATION_EMAIL,
        `Nouvelle soumission d'article: ${submissionData.title}`,
        adminHtmlContent,
        adminTextContent,
        submissionData.corresponding_author_email
      );
      
      emailResults.push({
        type: 'admin',
        success: adminEmailResult.success,
        data: adminEmailResult.data,
        error: adminEmailResult.error
      });

      // Send user confirmation email
      console.log("[notify-submission] Sending user confirmation email");
      const userEmailResult = await sendEmail(
        submissionData.corresponding_author_email,
        `Confirmation de soumission: ${submissionData.title}`,
        userHtmlContent,
        userTextContent
      );
      
      emailResults.push({
        type: 'user',
        success: userEmailResult.success,
        data: userEmailResult.data,
        error: userEmailResult.error
      });

      // Check if both emails were successful
      const adminSuccess = emailResults.find(r => r.type === 'admin')?.success;
      const userSuccess = emailResults.find(r => r.type === 'user')?.success;

      if (adminSuccess && userSuccess) {
        console.log("[notify-submission] Both admin and user emails sent successfully");
        return createSuccessResponse({ 
          success: true,
          message: "Email notifications sent successfully to both admin and user",
          results: emailResults
        }, 200, corsHeaders);
      }
      
      // If admin email failed, try backup method
      if (!adminSuccess) {
        console.log("[notify-submission] Admin email failed, trying backup method");
        const adminBackupResult = await sendBackupEmail(
          NOTIFICATION_EMAIL,
          `Nouvelle soumission - ${submissionData.title}`,
          adminTextContent
        );
        
        emailResults[0] = {
          type: 'admin',
          success: adminBackupResult.success,
          data: adminBackupResult.data,
          error: adminBackupResult.error,
          backup: true
        };
      }

      // If user email failed, try backup method
      if (!userSuccess) {
        console.log("[notify-submission] User email failed, trying backup method");
        const userBackupResult = await sendBackupEmail(
          submissionData.corresponding_author_email,
          `Confirmation de soumission - ${submissionData.title}`,
          userTextContent
        );
        
        emailResults[1] = {
          type: 'user',
          success: userBackupResult.success,
          data: userBackupResult.data,
          error: userBackupResult.error,
          backup: true
        };
      }

      // Final check after backup attempts
      const finalAdminSuccess = emailResults.find(r => r.type === 'admin')?.success;
      const finalUserSuccess = emailResults.find(r => r.type === 'user')?.success;

      if (finalAdminSuccess || finalUserSuccess) {
        const message = finalAdminSuccess && finalUserSuccess ? 
          "Email notifications sent successfully to both admin and user" :
          finalAdminSuccess ? "Admin notification sent, but user confirmation failed" :
          "User confirmation sent, but admin notification failed";
        
        console.log(`[notify-submission] ${message}`);
        return createSuccessResponse({ 
          success: true,
          message: message,
          results: emailResults
        }, 200, corsHeaders);
      }
      
      // If both methods fail for both emails, return error
      throw new Error("Both admin and user email sending failed with all methods");
      
    } catch (emailErr) {
      logError("[notify-submission] Error sending email notifications", emailErr);
      return createErrorResponse(
        "Failed to send email notifications", 
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
