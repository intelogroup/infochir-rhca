
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const RECIPIENT_EMAILS = ["jayveedz19@gmail.com", "tlmq15@gmail.com"];

// Updated CORS configuration to include all required headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-client-mode, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    console.log("Contact email function called");
    
    let formData: ContactFormData;
    try {
      formData = await req.json();
      console.log("Form data received:", formData);
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { name, email, phone, message } = formData;
    
    // Validate required fields
    if (!name || !email || !message) {
      console.error("Missing required fields:", { name, email, message });
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to admins
    try {
      const emailResponse = await resend.emails.send({
        from: "InfoChir Contact <onboarding@resend.dev>",
        to: RECIPIENT_EMAILS,
        subject: `Nouveau message de contact de ${name}`,
        html: `
          <h1>Nouveau message de contact</h1>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
          <h2>Message:</h2>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });

      console.log("Admin email sent successfully:", emailResponse);
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
      throw new Error(`Failed to send admin notification: ${emailError.message}`);
    }

    // Also send confirmation email to the sender
    try {
      const confirmationResponse = await resend.emails.send({
        from: "InfoChir <onboarding@resend.dev>",
        to: [email],
        subject: "Nous avons reçu votre message",
        html: `
          <h1>Merci de nous avoir contactés, ${name}!</h1>
          <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
          <p>Cordialement,<br>L'équipe InfoChir</p>
        `,
      });

      console.log("Confirmation email sent successfully:", confirmationResponse);
    } catch (confirmError) {
      console.error("Error sending confirmation email:", confirmError);
      // Continue with success response even if confirmation email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Contact message sent successfully"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unknown error occurred",
        success: false
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
