
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { sendEmail } from "../_shared/email-sender.ts";

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
  notification?: {
    sent: boolean;
    message?: string;
  };
}

// Get environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Notification recipient email - updated to the specified email
const NOTIFICATION_EMAIL = "jimkalinov@gmail.com";

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  console.log("Newsletter subscription function called");
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight request - improved with proper handling
  const corsResponse = handleCors(req);
  if (corsResponse) {
    console.log("Returning CORS preflight response");
    return corsResponse;
  }

  try {
    // Validate method
    if (req.method !== "POST") {
      console.error(`Invalid method: ${req.method}`);
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

    // Test service role key length
    if (!serviceRoleKey || serviceRoleKey.length < 10) {
      console.error("Invalid service role key");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Configuration error: Invalid service role key" 
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

    // Test Supabase URL format
    if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes("supabase.co")) {
      console.error("Invalid Supabase URL:", supabaseUrl);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Configuration error: Invalid Supabase URL" 
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

    console.log("Creating Supabase client with URL:", supabaseUrl);
    
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if email already exists
    console.log("Checking if email already exists:", email);
    const { data: existingData, error: searchError } = await supabase
      .from("newsletter_subscriptions")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (searchError) {
      console.error("Error checking existing subscription:", searchError);
      throw new Error(`Database error: ${searchError.message}`);
    }

    let notificationResult = { sent: false };

    // If email already exists, return success but indicate it's a duplicate
    if (existingData) {
      console.log("Existing subscription found for email:", email);
      
      // Still send a notification for the duplicate subscription attempt
      notificationResult = await sendNotification(name, email, phone, true);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Already subscribed", 
          existingSubscription: true,
          notification: notificationResult
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
    console.log("Inserting new subscription for:", name, email);
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
    
    // Send notification email
    notificationResult = await sendNotification(name, email, phone, false);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed to newsletter",
        notification: notificationResult
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
    
    // Add detailed error information for debugging
    let errorDetails: any = {
      message: error instanceof Error ? error.message : "Unknown error occurred",
      type: error instanceof Error ? error.constructor.name : typeof error
    };
    
    if (error instanceof Error && 'stack' in error) {
      errorDetails.stack = error.stack;
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorDetails.message,
        errorDetails: isDebugMode() ? errorDetails : undefined
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

// Helper function to check if we're in debug mode
function isDebugMode() {
  const debugFlag = Deno.env.get("DEBUG");
  return debugFlag === "true" || debugFlag === "1";
}

/**
 * Send notification email to admin about a new subscription
 */
async function sendNotification(
  name: string, 
  email: string, 
  phone?: string, 
  isDuplicate: boolean = false
): Promise<{sent: boolean; message?: string}> {
  try {
    console.log(`Sending newsletter subscription notification to ${NOTIFICATION_EMAIL}`);
    
    const subscriptionTime = new Date().toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${isDuplicate ? 'Newsletter Subscription Attempt (Duplicate)' : 'New Newsletter Subscription'}</h2>
        <p>A ${isDuplicate ? 'user attempted to subscribe again' : 'new user has subscribed'} to the newsletter at ${subscriptionTime}.</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Subscriber Information:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Status:</strong> ${isDuplicate ? 'Already subscribed' : 'New subscription'}</p>
        </div>
        
        <p style="color: #666; font-size: 12px;">This is an automated notification from your InfoChir website.</p>
      </div>
    `;
    
    const text = `
      ${isDuplicate ? 'NEWSLETTER SUBSCRIPTION ATTEMPT (DUPLICATE)' : 'NEW NEWSLETTER SUBSCRIPTION'}
      
      A ${isDuplicate ? 'user attempted to subscribe again' : 'new user has subscribed'} to the newsletter at ${subscriptionTime}.
      
      Subscriber Information:
      Name: ${name}
      Email: ${email}
      ${phone ? `Phone: ${phone}` : ''}
      Status: ${isDuplicate ? 'Already subscribed' : 'New subscription'}
      
      This is an automated notification from your InfoChir website.
    `;
    
    const emailResult = await sendEmail(
      NOTIFICATION_EMAIL,
      `${isDuplicate ? '[DUPLICATE] ' : ''}InfoChir Newsletter Subscription: ${name}`,
      html,
      text,
      email // set reply-to as the subscriber's email
    );
    
    if (emailResult.success) {
      console.log("Newsletter notification email sent successfully");
      return { sent: true };
    } else {
      console.error("Failed to send newsletter notification email:", emailResult.error);
      return { 
        sent: false, 
        message: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error)
      };
    }
  } catch (error) {
    console.error("Error sending newsletter notification:", error);
    return { 
      sent: false, 
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

// Serve the handler
serve(handler);
