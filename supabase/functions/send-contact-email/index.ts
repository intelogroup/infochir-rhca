
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/email-sender.ts";

// Email notification recipient - updated to the specified email
const NOTIFICATION_EMAIL = "jimkalinov@gmail.com";

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

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

    // Prepare email content
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
    
    // Send email notification
    const emailResult = await sendEmail(
      NOTIFICATION_EMAIL,
      `Contact InfoChir de: ${data.name}`,
      html,
      text,
      data.email // set reply-to as the sender's email
    );
    
    if (emailResult.success) {
      console.log("[send-contact-email] Contact notification email sent successfully");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Contact message sent successfully",
          notification: { sent: true } 
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
      console.error("[send-contact-email] Failed to send contact notification email:", emailResult.error);
      return new Response(
        JSON.stringify({ 
          success: true, // Still mark as success since the form data was saved
          message: "Contact message received but notification failed to send",
          notification: { 
            sent: false, 
            message: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error)
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
    }
  } catch (error) {
    console.error("[send-contact-email] Unhandled error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        notification: { sent: false }
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

serve(handler);
