
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/email-sender.ts";
import { 
  generateSubmissionHtmlContent, 
  generateSubmissionTextContent,
  generateUserConfirmationHtmlContent,
  generateUserConfirmationTextContent 
} from "../_shared/email-templates/index.ts";

// Admin notification recipients
const ADMIN_EMAILS = ["jimkalinov@gmail.com", "jalouidor@hotmail.com"];

// Helper function to add delay between emails
const delay = (ms: number) => New Promise(resolve => setTimeout(resolve, ms));

const handler = async (req: Request): Promise<Response> => {
  console.log("[notify-submission] Function called");

  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const submissionData = await req.json();
    console.log("[notify-submission] Received submission data:", {
      title: submissionData.title,
      userEmail: submissionData.corresponding_author_email,
      publicationType: submissionData.publication_type
    });

    // Send admin notifications with delays
    const adminResults = await sendAdminNotifications(submissionData);
    
    // Add delay before sending user confirmation to respect rate limits
    console.log("[notify-submission] Waiting 600ms before sending user confirmation to respect rate limits");
    await delay(600);
    
    // Send user confirmation
    const userResult = await sendUserConfirmation(submissionData);

    // Determine overall success
    const adminSuccessCount = adminResults.filter(result => result.success).length;
    const overallSuccess = adminSuccessCount > 0 || userResult.success;

    if (overallSuccess) {
      console.log("[notify-submission] Notifications completed successfully");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Submission notifications sent successfully",
          results: [
            ...adminResults.map(result => ({ ...result, type: 'admin' })),
            { ...userResult, type: 'user' }
          ]
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
          message: "Failed to send notifications",
          results: [
            ...adminResults.map(result => ({ ...result, type: 'admin' })),
            { ...userResult, type: 'user' }
          ]
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

/**
 * Send notification emails to all admin addresses about the submission
 */
async function sendAdminNotifications(submissionData: any): Promise<{success: boolean; sent: boolean; message?: string; recipient: string}[]> {
  const results = [];
  
  for (let i = 0; i < ADMIN_EMAILS.length; i++) {
    const adminEmail = ADMIN_EMAILS[i];
    
    // Add delay between admin emails to respect rate limits (except for first email)
    if (i > 0) {
      console.log(`[notify-submission] Waiting 600ms before sending to ${adminEmail} to respect rate limits`);
      await delay(600);
    }
    
    try {
      console.log(`[notify-submission] Sending admin notification to ${adminEmail}`);
      
      const submissionTime = new Date().toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'medium'
      });
      
      const html = generateSubmissionHtmlContent(submissionData, submissionTime);
      const text = generateSubmissionTextContent(submissionData, submissionTime);
      
      const emailResult = await sendEmail(
        adminEmail,
        `Nouvelle soumission d'article: ${submissionData.title}`,
        html,
        text,
        submissionData.corresponding_author_email
      );
      
      if (emailResult.success) {
        console.log(`[notify-submission] Admin notification sent successfully to ${adminEmail}`);
        results.push({ success: true, sent: true, recipient: adminEmail });
      } else {
        console.error(`[notify-submission] Failed to send admin notification to ${adminEmail}:`, emailResult.error);
        results.push({
          success: false,
          sent: false,
          recipient: adminEmail,
          message: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error)
        });
      }
    } catch (error) {
      console.error(`[notify-submission] Error sending admin notification to ${adminEmail}:`, error);
      results.push({
        success: false,
        sent: false,
        recipient: adminEmail,
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  return results;
}

/**
 * Send confirmation email to the user who submitted the article
 */
async function sendUserConfirmation(submissionData: any): Promise<{success: boolean; sent: boolean; message?: string}> {
  try {
    console.log("[notify-submission] Sending user confirmation email");
    
    const submissionTime = new Date().toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });
    
    const html = generateUserConfirmationHtmlContent(submissionData, submissionTime);
    const text = generateUserConfirmationTextContent(submissionData, submissionTime);
    
    const emailResult = await sendEmail(
      submissionData.corresponding_author_email,
      "Confirmation de réception - Votre soumission d'article",
      html,
      text
    );
    
    if (emailResult.success) {
      console.log("[notify-submission] User confirmation email sent successfully");
      return { success: true, sent: true };
    } else {
      console.error("[notify-submission] Failed to send user confirmation email:", emailResult.error);
      return {
        success: false,
        sent: false,
        message: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error)
      };
    }
  } catch (error) {
    console.error("[notify-submission] Error sending user confirmation email:", error);
    return {
      success: false,
      sent: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

serve(handler);
