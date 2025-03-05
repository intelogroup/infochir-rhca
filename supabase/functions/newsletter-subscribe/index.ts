
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const RECIPIENT_EMAIL = "jayveedz19@gmail.com";

// Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterData {
  name: string;
  email: string;
  phone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone }: NewsletterData = await req.json();

    console.log("Received newsletter subscription:", { name, email, phone });

    // Store in database
    const { data, error } = await supabase
      .from("newsletter_subscriptions")
      .insert([
        { name, email, phone }
      ])
      .select();

    if (error) {
      console.error("Error saving to database:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    // Notify admin
    await resend.emails.send({
      from: "InfoChir Newsletter <onboarding@resend.dev>",
      to: [RECIPIENT_EMAIL],
      subject: "Nouvelle inscription à la newsletter",
      html: `
        <h1>Nouvelle inscription à la newsletter</h1>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
      `,
    });

    // Send confirmation to subscriber
    await resend.emails.send({
      from: "InfoChir <onboarding@resend.dev>",
      to: [email],
      subject: "Bienvenue à la newsletter InfoChir",
      html: `
        <h1>Merci de votre inscription, ${name}!</h1>
        <p>Vous êtes maintenant inscrit(e) à notre newsletter et recevrez nos prochaines actualités.</p>
        <p>Cordialement,<br>L'équipe InfoChir</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in newsletter-subscribe function:", error);
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
