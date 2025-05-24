
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

// Email notification recipient
const NOTIFICATION_EMAIL = "jimkalinov@gmail.com";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

/**
 * Retry mechanism for email sending
 */
async function retryEmailSend(
  emailFunc: () => Promise<{ success: boolean; data?: any; error?: any }>,
  maxRetries: number = MAX_RETRIES
): Promise<{ success: boolean; data?: any; error?: any; retries: number }> {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[notify-submission] Email attempt ${attempt + 1}/${maxRetries + 1}`);
      const result = await emailFunc();
      
      if (result.success) {
        console.log(`[notify-submission] Email succeeded on attempt ${attempt + 1}`);
        return { ...result, retries: attempt };
      }
      
      lastError = result.error;
      console.log(`[notify-submission] Email failed on attempt ${attempt + 1}:`, result.error);
      
      // Wait before retry (except on last attempt)
      if (attempt < maxRetries) {
        console.log(`[notify-submission] Waiting ${RETRY_DELAY}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    } catch (error) {
      lastError = error;
      console.error(`[notify-submission] Email attempt ${attempt + 1} threw error:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  return { success: false, error: lastError, retries: maxRetries + 1 };
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }
  
  try {
    console.log("[notify-submission] === EMAIL NOTIFICATION FUNCTION STARTED ===");
    console.log("[notify-submission] Environment check:");
    console.log("- RESEND_API_KEY present:", !!Deno.env.get("RESEND_API_KEY"));
    console.log("- SUPABASE_URL:", Deno.env.get('SUPABASE_URL'));
    console.log("- Request method:", req.method);
    console.log("- Request headers:", Object.fromEntries(req.headers.entries()));
    
    // Verify API key is valid before attempting to send
    console.log("[notify-submission] Checking Resend API key...");
    const apiKeyCheck = await checkResendApiKey();
    console.log("[notify-submission] API key check result:", apiKeyCheck);
    
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
    console.log("[notify-submission] Received submission data:", {
      title: submissionData.title,
      type: submissionData.publication_type,
      author: submissionData.corresponding_author_name,
      email: submissionData.corresponding_author_email,
      hasArticleFiles: !!submissionData.article_files_urls,
      articleFilesCount: submissionData.article_files_urls?.length || 0
    });
    
    // Validate required fields
    if (!submissionData.corresponding_author_email) {
      console.error("[notify-submission] Missing user email address");
      return createErrorResponse("Missing user email address", 400, corsHeaders);
    }
    
    if (!submissionData.title) {
      console.error("[notify-submission] Missing submission title");
      return createErrorResponse("Missing submission title", 400, corsHeaders);
    }
    
    // Format the submission date for the email
    const formattedDate = new Date().toLocaleString('fr-FR', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'medium'
    });
    console.log("[notify-submission] Formatted date:", formattedDate);

    // Generate email content
    console.log("[notify-submission] Generating email content...");
    const adminHtmlContent = generateSubmissionHtmlContent(submissionData, formattedDate);
    const adminTextContent = generateSubmissionTextContent(submissionData, formattedDate);
    const userHtmlContent = generateUserConfirmationHtmlContent(submissionData, formattedDate);
    const userTextContent = generateUserConfirmationTextContent(submissionData, formattedDate);
    
    console.log("[notify-submission] Email content generated successfully");
    console.log("- Admin HTML length:", adminHtmlContent.length);
    console.log("- Admin text length:", adminTextContent.length);
    console.log("- User HTML length:", userHtmlContent.length);
    console.log("- User text length:", userTextContent.length);

    const emailResults = [];

    // Send admin notification email with retry
    console.log("[notify-submission] === SENDING ADMIN NOTIFICATION ===");
    console.log("- To:", NOTIFICATION_EMAIL);
    console.log("- Subject: Nouvelle soumission d'article:", submissionData.title);
    
    const adminEmailResult = await retryEmailSend(async () => {
      return await sendEmail(
        NOTIFICATION_EMAIL,
        `Nouvelle soumission d'article: ${submissionData.title}`,
        adminHtmlContent,
        adminTextContent,
        submissionData.corresponding_author_email
      );
    });
    
    console.log("[notify-submission] Admin email result:", {
      success: adminEmailResult.success,
      retries: adminEmailResult.retries,
      hasError: !!adminEmailResult.error
    });
    
    emailResults.push({
      type: 'admin',
      success: adminEmailResult.success,
      data: adminEmailResult.data,
      error: adminEmailResult.error,
      retries: adminEmailResult.retries
    });

    // Send user confirmation email with retry
    console.log("[notify-submission] === SENDING USER CONFIRMATION ===");
    console.log("- To:", submissionData.corresponding_author_email);
    console.log("- Subject: Confirmation de soumission:", submissionData.title);
    
    const userEmailResult = await retryEmailSend(async () => {
      return await sendEmail(
        submissionData.corresponding_author_email,
        `Confirmation de soumission: ${submissionData.title}`,
        userHtmlContent,
        userTextContent
      );
    });
    
    console.log("[notify-submission] User email result:", {
      success: userEmailResult.success,
      retries: userEmailResult.retries,
      hasError: !!userEmailResult.error
    });
    
    emailResults.push({
      type: 'user',
      success: userEmailResult.success,
      data: userEmailResult.data,
      error: userEmailResult.error,
      retries: userEmailResult.retries
    });

    // Check results and try backup methods if needed
    const adminSuccess = emailResults.find(r => r.type === 'admin')?.success;
    const userSuccess = emailResults.find(r => r.type === 'user')?.success;

    console.log("[notify-submission] === EMAIL RESULTS SUMMARY ===");
    console.log("- Admin email success:", adminSuccess);
    console.log("- User email success:", userSuccess);

    if (adminSuccess && userSuccess) {
      console.log("[notify-submission] ✅ Both emails sent successfully");
      return createSuccessResponse({ 
        success: true,
        message: "Email notifications sent successfully to both admin and user",
        results: emailResults
      }, 200, corsHeaders);
    }
    
    // Try backup methods for failed emails
    if (!adminSuccess) {
      console.log("[notify-submission] 🔄 Admin email failed, trying backup method");
      const adminBackupResult = await retryEmailSend(async () => {
        return await sendBackupEmail(
          NOTIFICATION_EMAIL,
          `Nouvelle soumission - ${submissionData.title}`,
          adminTextContent
        );
      }, 2); // Fewer retries for backup method
      
      console.log("[notify-submission] Admin backup result:", {
        success: adminBackupResult.success,
        retries: adminBackupResult.retries
      });
      
      emailResults[0] = {
        type: 'admin',
        success: adminBackupResult.success,
        data: adminBackupResult.data,
        error: adminBackupResult.error,
        backup: true,
        retries: adminBackupResult.retries
      };
    }

    if (!userSuccess) {
      console.log("[notify-submission] 🔄 User email failed, trying backup method");
      const userBackupResult = await retryEmailSend(async () => {
        return await sendBackupEmail(
          submissionData.corresponding_author_email,
          `Confirmation de soumission - ${submissionData.title}`,
          userTextContent
        );
      }, 2); // Fewer retries for backup method
      
      console.log("[notify-submission] User backup result:", {
        success: userBackupResult.success,
        retries: userBackupResult.retries
      });
      
      emailResults[1] = {
        type: 'user',
        success: userBackupResult.success,
        data: userBackupResult.data,
        error: userBackupResult.error,
        backup: true,
        retries: userBackupResult.retries
      };
    }

    // Final check after backup attempts
    const finalAdminSuccess = emailResults.find(r => r.type === 'admin')?.success;
    const finalUserSuccess = emailResults.find(r => r.type === 'user')?.success;

    console.log("[notify-submission] === FINAL RESULTS ===");
    console.log("- Final admin success:", finalAdminSuccess);
    console.log("- Final user success:", finalUserSuccess);
    console.log("- Email results:", emailResults);

    if (finalAdminSuccess || finalUserSuccess) {
      const message = finalAdminSuccess && finalUserSuccess ? 
        "Email notifications sent successfully to both admin and user" :
        finalAdminSuccess ? "Admin notification sent, but user confirmation failed" :
        "User confirmation sent, but admin notification failed";
      
      console.log(`[notify-submission] ✅ ${message}`);
      return createSuccessResponse({ 
        success: true,
        message: message,
        results: emailResults
      }, 200, corsHeaders);
    }
    
    // If all methods fail
    console.error("[notify-submission] ❌ All email sending methods failed");
    throw new Error("Both admin and user email sending failed with all methods");
      
  } catch (err) {
    console.error("[notify-submission] ❌ CRITICAL ERROR:", err);
    console.error("[notify-submission] Error stack:", err.stack);
    logError("[notify-submission] Error in notify-submission function", err);
    return createErrorResponse(
      err.message || 'Internal server error', 
      500, 
      corsHeaders, 
      err
    );
  }
});
