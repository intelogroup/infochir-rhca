
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Create a Supabase client with the Admin key to bypass RLS
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  { auth: { persistSession: false } }
);

/**
 * Send a notification email about the submission
 */
async function sendNotificationEmail(submissionData) {
  try {
    console.log("[submit-article] Preparing to send notification email");
    console.log("[submit-article] SUPABASE_URL:", Deno.env.get('SUPABASE_URL'));
    console.log("[submit-article] SUPABASE_ANON_KEY present:", !!Deno.env.get('SUPABASE_ANON_KEY'));
    
    // Call the notification edge function
    const notifyUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/notify-submission`;
    console.log("[submit-article] Calling notification endpoint:", notifyUrl);
    
    const notifyResponse = await fetch(
      notifyUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify(submissionData)
      }
    );
    
    // Get response data as text first for debugging
    const responseText = await notifyResponse.text();
    console.log("[submit-article] Notification response status:", notifyResponse.status);
    console.log("[submit-article] Notification response text:", responseText);
    
    // Attempt to send a direct test email as well, for debugging purposes
    try {
      await sendDirectTestEmail(submissionData);
    } catch (testEmailError) {
      console.error("[submit-article] Direct test email failed:", testEmailError);
    }
    
    // Parse the text as JSON if possible
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[submit-article] Failed to parse response as JSON:", parseError);
      return false;
    }
    
    if (!notifyResponse.ok) {
      console.error("[submit-article] Failed to send notification:", responseData);
      return false;
    }
    
    console.log("[submit-article] Notification sent successfully");
    return true;
  } catch (error) {
    console.error("[submit-article] Error sending notification:", error);
    console.error("[submit-article] Error stack:", error.stack);
    return false;
  }
}

/**
 * Directly send a test email for debugging purposes
 */
async function sendDirectTestEmail(submissionData) {
  console.log("[submit-article] Attempting direct test email");
  
  const EMAIL_SERVICE_API_URL = "https://api.smtp2go.com/v3/email/send";
  const API_KEY = Deno.env.get("SMTP2GO_API_KEY");
  
  if (!API_KEY) {
    console.error("[submit-article] No SMTP2GO_API_KEY environment variable set");
    return;
  }
  
  const emailData = {
    api_key: API_KEY,
    to: ["jayveedz19@gmail.com"],
    sender: "InfoChir Test <test@infochir.org>",
    subject: `TEST - Direct Email: New Submission (${new Date().toISOString()})`,
    text_body: `This is a direct test email from the submit-article function.
      
      Submission: ${submissionData.title}
      Type: ${submissionData.publication_type}
      Author: ${submissionData.corresponding_author_name}
      
      This email bypasses the notify-submission function for testing purposes.`,
  };
  
  const response = await fetch(EMAIL_SERVICE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });
  
  const responseData = await response.json();
  console.log("[submit-article] Direct test email response:", responseData);
  
  if (!response.ok) {
    throw new Error(`Direct test email failed with status ${response.status}: ${JSON.stringify(responseData)}`);
  }
  
  console.log("[submit-article] Direct test email sent successfully");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the submission data from the request
    const submissionData = await req.json();
    
    // Log the submission attempt
    console.log("[submit-article] Received submission request:", {
      title: submissionData.title,
      publication_type: submissionData.publication_type,
      user_id: submissionData.user_id || 'anonymous'
    });
    
    // Basic validation - ensure required fields are present
    const requiredFields = ['title', 'authors', 'abstract', 'publication_type'];
    for (const field of requiredFields) {
      if (!submissionData[field]) {
        console.error(`[submit-article] Missing required field: ${field}`);
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    console.log("[submit-article] Validation passed, inserting submission");
    console.log("[submit-article] SUPABASE_URL:", Deno.env.get('SUPABASE_URL'));
    console.log("[submit-article] SERVICE_ROLE_KEY present:", !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    
    // Insert the submission with admin privileges (bypassing RLS)
    const { data, error } = await supabaseAdmin
      .from('article_submissions')
      .insert(submissionData)
      .select()
      .single();
      
    if (error) {
      console.error("[submit-article] Error inserting submission:", error);
      console.error("[submit-article] Error details:", JSON.stringify(error));
      
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log("[submit-article] Submission successful:", data?.id);
    
    // Send notification email about the submission
    const notificationSent = await sendNotificationEmail(submissionData);
    console.log("[submit-article] Notification email sent status:", notificationSent);
    
    if (!notificationSent) {
      console.warn("[submit-article] Notification email could not be sent, but submission was saved successfully");
    }
    
    return new Response(
      JSON.stringify({
        ...data,
        notification_sent: notificationSent
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    console.error("[submit-article] Unexpected error:", err);
    console.error("[submit-article] Error stack:", err.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        errorDetails: err.message,
        errorStack: err.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
