
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendOptimizedBatch, getTodayEmailUsage } from "../_shared/optimized-email-sender.ts";
import { 
  generateSubmissionHtmlContent, 
  generateSubmissionTextContent,
  generateUserConfirmationHtmlContent,
  generateUserConfirmationTextContent 
} from "../_shared/email-templates/index.ts";

// Admin notification recipients
const ADMIN_EMAILS = ["jimkalinov@gmail.com", "jalouidor@hotmail.com"];

const handler = async (req: Request): Promise<Response> => {
  console.log("[notify-submission] Function called with file attachment support");

  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const submissionData = await req.json();
    console.log("[notify-submission] Received submission data:", {
      title: submissionData.title,
      userEmail: submissionData.corresponding_author_email,
      publicationType: submissionData.publication_type,
      articleFiles: submissionData.article_files_urls?.length || 0,
      imageAnnexes: submissionData.image_annexes_urls?.length || 0
    });

    // Get current email usage for logging
    const usage = await getTodayEmailUsage();
    console.log("[notify-submission] Current email usage:", usage);

    // Prepare email content
    const submissionTime = new Date().toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Admin email content
    const adminHtml = generateSubmissionHtmlContent(submissionData, submissionTime);
    const adminText = generateSubmissionTextContent(submissionData, submissionTime);
    const adminSubject = `Nouvelle soumission d'article: ${submissionData.title}`;

    // User confirmation content
    const userHtml = generateUserConfirmationHtmlContent(submissionData, submissionTime);
    const userText = generateUserConfirmationTextContent(submissionData, submissionTime);
    const userSubject = "Confirmation de réception - Votre soumission d'article";

    // Extract file URLs for attachments
    const articleFiles = submissionData.article_files_urls || [];
    const imageAnnexes = submissionData.image_annexes_urls || [];

    console.log("[notify-submission] Preparing to send emails with attachments:", {
      articleFiles: articleFiles.length,
      imageAnnexes: imageAnnexes.length
    });

    // Send optimized batch emails with file attachments
    console.log("[notify-submission] Sending optimized batch emails with file attachments");
    const emailResults = await sendOptimizedBatch(
      submissionData.corresponding_author_email,
      userSubject,
      userHtml,
      userText,
      ADMIN_EMAILS,
      adminSubject,
      adminHtml,
      adminText,
      submissionData.id,
      submissionData.corresponding_author_email,
      articleFiles, // Pass article files for admin attachments
      imageAnnexes  // Pass image annexes for admin attachments
    );

    // Determine overall success
    const userSuccess = emailResults.userResult.success;
    const adminSuccessCount = emailResults.adminResults.filter(result => result.success).length;
    const overallSuccess = userSuccess || adminSuccessCount > 0;

    console.log("[notify-submission] Email batch completed with attachments:", {
      strategy: emailResults.strategy,
      userSent: emailResults.userResult.sent,
      userQueued: emailResults.userResult.queued,
      adminResultsCount: emailResults.adminResults.length,
      remainingEmails: emailResults.usage.remaining,
      attachmentsSent: (articleFiles.length + imageAnnexes.length) > 0
    });

    if (overallSuccess) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Submission notifications processed successfully with attachments",
          emailStrategy: emailResults.strategy,
          usage: emailResults.usage,
          attachments: {
            articleFiles: articleFiles.length,
            imageAnnexes: imageAnnexes.length,
            total: articleFiles.length + imageAnnexes.length
          },
          results: {
            user: emailResults.userResult,
            admin: emailResults.adminResults
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    } else {
      console.error("[notify-submission] All notifications failed");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to process notifications",
          emailStrategy: emailResults.strategy,
          usage: emailResults.usage,
          attachments: {
            articleFiles: articleFiles.length,
            imageAnnexes: imageAnnexes.length,
            total: articleFiles.length + imageAnnexes.length
          },
          results: {
            user: emailResults.userResult,
            admin: emailResults.adminResults
          }
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
  } catch (error) {
    console.error("[notify-submission] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);
