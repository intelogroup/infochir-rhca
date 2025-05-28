
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/email-sender.ts";
import { 
  getQueuedEmails, 
  removeFromQueue, 
  incrementRetryCount, 
  updateEmailUsage,
  canSendEmail 
} from "../_shared/email-queue.ts";

// Helper function to add delay between emails
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (req: Request): Promise<Response> => {
  console.log("[process-email-queue] Function called");

  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Check if we can send emails today
    const { canSend, remaining } = await canSendEmail();
    
    if (!canSend) {
      console.log("[process-email-queue] Daily email limit reached, skipping queue processing");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Daily email limit reached",
          processed: 0,
          remaining: 0
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Get queued emails up to remaining limit
    const queuedEmails = await getQueuedEmails(Math.min(remaining, 10));
    console.log(`[process-email-queue] Found ${queuedEmails.length} queued emails to process`);

    if (queuedEmails.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No emails in queue to process",
          processed: 0,
          remaining
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    let processed = 0;
    let successful = 0;
    let failed = 0;

    // Process each queued email
    for (const email of queuedEmails) {
      try {
        console.log(`[process-email-queue] Processing email ${email.id} for ${email.recipient}`);
        
        // Send the email
        const result = await sendEmail(
          email.recipient,
          email.subject,
          email.html,
          email.text,
          email.reply_to
        );

        // Update usage statistics
        await updateEmailUsage(result.success);

        if (result.success) {
          console.log(`[process-email-queue] Successfully sent email ${email.id}`);
          await removeFromQueue(email.id!);
          successful++;
        } else {
          console.error(`[process-email-queue] Failed to send email ${email.id}:`, result.error);
          await incrementRetryCount(email.id!);
          failed++;
        }

        processed++;

        // Add delay between emails to respect rate limits
        if (processed < queuedEmails.length) {
          await delay(600);
        }

        // Check if we've hit the daily limit
        const currentUsage = await canSendEmail();
        if (!currentUsage.canSend) {
          console.log("[process-email-queue] Hit daily limit during processing, stopping");
          break;
        }

      } catch (error) {
        console.error(`[process-email-queue] Error processing email ${email.id}:`, error);
        await incrementRetryCount(email.id!);
        failed++;
        processed++;
      }
    }

    console.log(`[process-email-queue] Processing complete: ${processed} processed, ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email queue processed",
        processed,
        successful,
        failed,
        remaining: (await canSendEmail()).remaining
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error) {
    console.error("[process-email-queue] Error:", error);
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
