
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const RECIPIENT_EMAIL = "jayveedz19@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message }: ContactFormData = await req.json();

    console.log("Received contact form submission:", { name, email, phone, message });

    const emailResponse = await resend.emails.send({
      from: "InfoChir Contact <onboarding@resend.dev>",
      to: [RECIPIENT_EMAIL],
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

    // Also send confirmation email to the sender
    await resend.emails.send({
      from: "InfoChir <onboarding@resend.dev>",
      to: [email],
      subject: "Nous avons reçu votre message",
      html: `
        <h1>Merci de nous avoir contactés, ${name}!</h1>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <p>Cordialement,<br>L'équipe InfoChir</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
