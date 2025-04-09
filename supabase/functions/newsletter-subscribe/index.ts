
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const RECIPIENT_EMAILS = ["jayveedz19@gmail.com", "tlmq15@gmail.com"];

// Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Updated CORS configuration to include all required headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-client-mode, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

interface NewsletterData {
  name: string;
  email: string;
  phone?: string;
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
    console.log("Newsletter subscribe function called");
    
    let requestData: NewsletterData;
    try {
      requestData = await req.json();
      console.log("Request data:", requestData);
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
    
    const { name, email, phone } = requestData;
    
    if (!name || !email) {
      console.error("Missing required fields:", { name, email });
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from("newsletter_subscriptions")
      .select("id")
      .eq("email", email)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking for existing subscription:", checkError);
      // Continue with the process, we'll attempt to insert anyway
    }
    
    if (existingSubscription) {
      console.log("Email already subscribed:", email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email already subscribed",
          existingSubscription: true
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Store in database
    const { data, error } = await supabase
      .from("newsletter_subscriptions")
      .insert([
        { name, email, phone }
      ])
      .select();

    if (error) {
      console.error("Error saving to database:", error);
      
      // Special handling for foreign key violations and unique constraints
      if (error.code === "23505") { // Unique violation
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Email already subscribed",
            existingSubscription: true
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      throw new Error(`Database error: ${error.message}`);
    }

    console.log("Successfully saved to database:", data);

    // Notify admin
    try {
      const adminEmailResponse = await resend.emails.send({
        from: "InfoChir Newsletter <onboarding@resend.dev>",
        to: RECIPIENT_EMAILS,
        subject: "Nouvelle inscription à la newsletter",
        html: `
          <h1>Nouvelle inscription à la newsletter</h1>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
        `,
      });
      
      console.log("Admin notification email sent:", adminEmailResponse);
    } catch (emailError) {
      console.error("Error sending admin notification:", emailError);
      // Continue with the rest of the process even if admin email fails
    }

    // Send confirmation to subscriber
    try {
      const subscriberEmailResponse = await resend.emails.send({
        from: "InfoChir <onboarding@resend.dev>",
        to: [email],
        subject: "Bienvenue à la newsletter InfoChir",
        html: `
          <h1>Merci de votre inscription, ${name}!</h1>
          <p>Vous êtes maintenant inscrit(e) à notre newsletter et recevrez nos prochaines actualités.</p>
          <p>Cordialement,<br>L'équipe InfoChir</p>
        `,
      });
      
      console.log("Subscriber confirmation email sent:", subscriberEmailResponse);
    } catch (emailError) {
      console.error("Error sending subscriber confirmation:", emailError);
      // Continue with success response even if confirmation email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Subscription successful"
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
    console.error("Error in newsletter-subscribe function:", error);
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
