
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/email-sender.ts";

// Email notification recipients - multiple admin emails
const ADMIN_EMAILS = [
  "jimkalinov@gmail.com",
  "jalouidor@hotmail.com",
  "eunicederivoismerisier@gmail.com",
];

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Helper function to add delay between emails
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (req: Request): Promise<Response> => {
  console.log("[send-contact-email] Function called");

  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const data: ContactRequest = await req.json();
    console.log("[send-contact-email] Received contact form data:", {
      name: data.name,
      email: data.email,
      messageLength: data.message?.length || 0
    });
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      console.error("[send-contact-email] Missing required fields");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Name, email, and message are required" 
        }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Send admin notifications to all admin emails with delays
    const adminNotificationResults = await sendAdminNotifications(data);
    
    // Add delay before sending user acknowledgment to respect rate limits
    console.log("[send-contact-email] Waiting 600ms before sending user acknowledgment to respect rate limits");
    await delay(600); // 600ms delay to ensure we stay under 2 emails/second
    
    const userAcknowledgmentResult = await sendUserAcknowledgment(data);
    
    // Determine response based on email results
    const adminSuccessCount = adminNotificationResults.filter(result => result.success).length;
    const overallSuccess = adminSuccessCount > 0 || userAcknowledgmentResult.success;
    
    if (overallSuccess) {
      console.log("[send-contact-email] Contact form processed successfully");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Contact message sent successfully",
          notification: {
            admin: adminNotificationResults,
            user: userAcknowledgmentResult
          }
        }),
        { 
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    } else {
      console.error("[send-contact-email] All email notifications failed");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Failed to send notifications",
          notification: {
            admin: adminNotificationResults,
            user: userAcknowledgmentResult
          }
        }),
        { 
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
  } catch (error) {
    console.error("[send-contact-email] Unhandled error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        notification: { admin: [], user: { sent: false } }
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

/**
 * Send notification emails to all admin addresses about the contact form submission
 */
async function sendAdminNotifications(data: ContactRequest): Promise<{success: boolean; sent: boolean; message?: string; recipient: string}[]> {
  const results = [];
  
  for (let i = 0; i < ADMIN_EMAILS.length; i++) {
    const adminEmail = ADMIN_EMAILS[i];
    
    // Add delay between admin emails to respect rate limits (except for first email)
    if (i > 0) {
      console.log(`[send-contact-email] Waiting 600ms before sending to ${adminEmail} to respect rate limits`);
      await delay(600); // 600ms delay between admin emails
    }
    
    try {
      console.log(`[send-contact-email] Sending admin notification to ${adminEmail}`);
      
      const contactTime = new Date().toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'medium'
      });
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nouveau message de contact</h2>
          <p>Un nouveau message a été envoyé via le formulaire de contact à ${contactTime}.</p>
          
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Informations de contact:</h3>
            <p><strong>Nom:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Téléphone:</strong> ${data.phone}</p>` : ''}
            
            <h3>Message:</h3>
            <p style="white-space: pre-line;">${data.message}</p>
          </div>
          
          <p style="color: #666; font-size: 12px;">Ceci est une notification automatique de votre site InfoChir.</p>
        </div>
      `;
      
      const text = `
        NOUVEAU MESSAGE DE CONTACT
        
        Un nouveau message a été envoyé via le formulaire de contact à ${contactTime}.
        
        Informations de contact:
        Nom: ${data.name}
        Email: ${data.email}
        ${data.phone ? `Téléphone: ${data.phone}` : ''}
        
        Message:
        ${data.message}
        
        Ceci est une notification automatique de votre site InfoChir.
      `;
      
      const emailResult = await sendEmail(
        adminEmail,
        `Contact InfoChir de: ${data.name}`,
        html,
        text,
        data.email // set reply-to as the sender's email
      );
      
      if (emailResult.success) {
        console.log(`[send-contact-email] Admin notification email sent successfully to ${adminEmail}`);
        results.push({ success: true, sent: true, recipient: adminEmail });
      } else {
        console.error(`[send-contact-email] Failed to send admin notification email to ${adminEmail}:`, emailResult.error);
        results.push({ 
          success: false, 
          sent: false, 
          recipient: adminEmail,
          message: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error)
        });
      }
    } catch (error) {
      console.error(`[send-contact-email] Error sending admin notification to ${adminEmail}:`, error);
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
 * Send acknowledgment email to the user who submitted the contact form
 */
async function sendUserAcknowledgment(data: ContactRequest): Promise<{success: boolean; sent: boolean; message?: string}> {
  try {
    console.log("[send-contact-email] Sending user acknowledgment email");
    
    const contactTime = new Date().toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message reçu - Info-Chir</title>
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
              .email-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #1E40AF, #41b06e); color: white; padding: 40px 30px; text-align: center; }
              .content { padding: 40px 30px; }
              .success-icon { font-size: 64px; margin-bottom: 20px; }
              .info-box { background: linear-gradient(135deg, #e8f4f8, #f0f8ff); padding: 25px; margin: 25px 0; border-radius: 10px; border-left: 5px solid #41b06e; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
              .team-message { background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; border: 2px solid #41b06e; }
              .contact-info { background: #f8f9ff; border-radius: 8px; padding: 20px; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <div class="success-icon">✉️</div>
                  <h1 style="margin: 0; font-size: 28px;">Message Reçu !</h1>
                  <p style="margin: 15px 0 0 0; opacity: 0.95; font-size: 16px;">Merci de nous avoir contactés</p>
              </div>
              
              <div class="content">
                  <div class="team-message">
                      <h2 style="color: #1E40AF; margin-top: 0;">🌟 L'équipe Info-Chir vous remercie !</h2>
                      <p style="font-size: 16px; margin: 15px 0;">Nous avons bien reçu votre message et nous vous en remercions. Notre équipe prendra le temps nécessaire pour vous fournir une réponse complète et utile.</p>
                      <p style="font-size: 16px; margin: 15px 0; font-weight: 500; color: #1E40AF;">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                  
                  <p style="font-size: 16px;">Bonjour <strong>${data.name}</strong>,</p>
                  
                  <p>Nous avons bien reçu votre message envoyé le ${contactTime}.</p>
                  
                  <div class="info-box">
                      <h3 style="margin-top: 0; color: #1E40AF;">📋 Récapitulatif de votre message</h3>
                      <p><strong>Nom :</strong> ${data.name}</p>
                      <p><strong>Email :</strong> ${data.email}</p>
                      ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ''}
                      <p><strong>Message :</strong></p>
                      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
                          <p style="margin: 0; white-space: pre-line; font-style: italic;">${data.message}</p>
                      </div>
                  </div>
                  
                  <div class="contact-info">
                      <h3 style="margin-top: 0; color: #1E40AF;">📞 Prochaines étapes</h3>
                      <p>Notre équipe examine votre message et vous contactera directement par email pour vous apporter une réponse personnalisée. En général, nous répondons dans un délai de 24 à 48 heures.</p>
                      <p>Si votre demande est urgente, n'hésitez pas à nous le préciser en répondant à cet email.</p>
                  </div>
                  
                  <p style="margin-top: 30px;">Nous vous remercions pour votre intérêt envers Info-Chir et restons à votre disposition.</p>
                  
                  <p style="margin-top: 25px;">
                      Cordialement,<br>
                      <strong>L'équipe Info-Chir</strong><br>
                      <span style="color: #666; font-style: italic;">Votre partenaire dans l'excellence chirurgicale</span>
                  </p>
              </div>
              
              <div class="footer">
                  <p><strong>Info-Chir</strong> - Plateforme de Publication Scientifique</p>
                  <p>Cet email de confirmation a été envoyé automatiquement. Pour toute question, répondez directement à cet email.</p>
              </div>
          </div>
      </body>
      </html>
    `;
    
    const text = `
✉️ MESSAGE REÇU !

🌟 L'ÉQUIPE INFO-CHIR VOUS REMERCIE !
═══════════════════════════════════════

Bonjour ${data.name},

Nous avons bien reçu votre message et nous vous en remercions. Notre équipe prendra le temps nécessaire pour vous fournir une réponse complète et utile.

🗓️ NOUS VOUS RÉPONDRONS DANS LES PLUS BREFS DÉLAIS.

📋 RÉCAPITULATIF DE VOTRE MESSAGE
═══════════════════════════════════════
Message reçu le : ${contactTime}

• Nom : ${data.name}
• Email : ${data.email}
${data.phone ? `• Téléphone : ${data.phone}` : ''}

Message :
${data.message}

📞 PROCHAINES ÉTAPES
═══════════════════════════════════════
Notre équipe examine votre message et vous contactera directement par email pour vous apporter une réponse personnalisée. En général, nous répondons dans un délai de 24 à 48 heures.

Si votre demande est urgente, n'hésitez pas à nous le préciser en répondant à cet email.

Nous vous remercions pour votre intérêt envers Info-Chir et restons à votre disposition.

Cordialement,
L'équipe Info-Chir
"Votre partenaire dans l'excellence chirurgicale"

───────────────────────────────────────
Info-Chir - Plateforme de Publication Scientifique
Cet email de confirmation a été envoyé automatiquement.
Pour toute question, répondez directement à cet email.
    `.trim();
    
    const emailResult = await sendEmail(
      data.email,
      "Info-Chir : Votre message a été reçu",
      html,
      text
    );
    
    if (emailResult.success) {
      console.log("[send-contact-email] User acknowledgment email sent successfully");
      return { success: true, sent: true };
    } else {
      console.error("[send-contact-email] Failed to send user acknowledgment email:", emailResult.error);
      return { 
        success: false, 
        sent: false, 
        message: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error)
      };
    }
  } catch (error) {
    console.error("[send-contact-email] Error sending user acknowledgment email:", error);
    return { 
      success: false, 
      sent: false, 
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

serve(handler);
