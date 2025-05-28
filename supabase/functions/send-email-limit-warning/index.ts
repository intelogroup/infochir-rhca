
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/email-sender.ts";

const handler = async (req: Request): Promise<Response> => {
  console.log("[send-email-limit-warning] Function called");

  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { remaining_emails, emails_sent_today } = await req.json();
    
    console.log(`[send-email-limit-warning] Sending warning: ${remaining_emails} emails remaining, ${emails_sent_today} sent today`);

    const subject = "⚠️ Email Limit Warning - Only 5 Emails Remaining";
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">⚠️ Email Limit Warning</h2>
        
        <div style="background-color: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">Daily Email Limit Almost Reached</h3>
          <p><strong>Emails sent today:</strong> ${emails_sent_today}/100</p>
          <p><strong>Emails remaining:</strong> ${remaining_emails}</p>
        </div>

        <h3>What happens next:</h3>
        <ul>
          <li>New submissions will queue admin notifications for tomorrow</li>
          <li>User confirmations will still be sent (prioritized)</li>
          <li>The queue will be processed automatically at midnight UTC</li>
        </ul>

        <p style="margin-top: 30px; color: #6b7280;">
          This is an automated warning from the InfoChir email optimization system.
        </p>
      </div>
    `;

    const textContent = `
⚠️ EMAIL LIMIT WARNING

Daily Email Limit Almost Reached

Emails sent today: ${emails_sent_today}/100
Emails remaining: ${remaining_emails}

What happens next:
- New submissions will queue admin notifications for tomorrow
- User confirmations will still be sent (prioritized)
- The queue will be processed automatically at midnight UTC

This is an automated warning from the InfoChir email optimization system.
    `;

    // Send warning email to primary admin
    const result = await sendEmail(
      "jimkalinov@gmail.com",
      subject,
      htmlContent,
      textContent
    );

    if (result.success) {
      console.log("[send-email-limit-warning] Warning email sent successfully");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email limit warning sent successfully"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    } else {
      console.error("[send-email-limit-warning] Failed to send warning email:", result.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send warning email"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

  } catch (error) {
    console.error("[send-email-limit-warning] Error:", error);
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
