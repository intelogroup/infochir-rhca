
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

// Types for request and response data
interface SubscriptionRequest {
  name: string;
  email: string;
  phone?: string;
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  existingSubscription?: boolean;
  error?: string;
}

// Get environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  console.log("Newsletter subscription function called");

  // Handle CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Validate method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Method not allowed" 
        }),
        { 
          status: 405,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Parse request body
    let data: SubscriptionRequest;
    try {
      data = await req.json();
      console.log("Request data:", data);
    } catch (e) {
      console.error("Error parsing request:", e);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body" 
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

    // Validate required fields
    const { name, email, phone } = data;
    if (!name || !email) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Name and email are required" 
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

    // Validate email format with a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid email format" 
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

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if email already exists
    const { data: existingData, error: searchError } = await supabase
      .from("newsletter_subscriptions")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (searchError) {
      console.error("Error checking existing subscription:", searchError);
      throw new Error(`Database error: ${searchError.message}`);
    }

    // If email already exists, return success but indicate it's a duplicate
    if (existingData) {
      console.log("Existing subscription found for email:", email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Already subscribed", 
          existingSubscription: true 
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

    // Insert new subscription
    const { data: insertData, error: insertError } = await supabase
      .from("newsletter_subscriptions")
      .insert([
        { 
          name, 
          email, 
          phone: phone || null,
          is_active: true
        }
      ])
      .select();

    if (insertError) {
      console.error("Error inserting subscription:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("Subscription successful:", insertData);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed to newsletter" 
      }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    // Log and return error response
    console.error("Unhandled error in newsletter subscription:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
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

// Serve the handler
serve(handler);
