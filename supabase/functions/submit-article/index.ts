
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { checkResendApiKey } from "../_shared/email-sender.ts";
import { logError, createErrorResponse, createSuccessResponse } from "../_shared/error-logger.ts";

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
    
    // Check if Resend API key is valid
    const apiKeyCheck = await checkResendApiKey();
    if (!apiKeyCheck.valid) {
      console.error("[submit-article] Resend API key issue:", apiKeyCheck.message);
      return false;
    }
    
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
      return {
        success: false,
        message: responseData.error || `Error: ${notifyResponse.status} ${notifyResponse.statusText}`
      };
    }
    
    console.log("[submit-article] Notification sent successfully");
    return {
      success: true,
      message: "Notification sent successfully"
    };
  } catch (error) {
    console.error("[submit-article] Error sending notification:", error);
    console.error("[submit-article] Error stack:", error.stack);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
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
        return createErrorResponse(
          `Missing required field: ${field}`,
          400, 
          corsHeaders
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
      
      return createErrorResponse(
        error.message,
        500, 
        corsHeaders, 
        error
      );
    }
    
    console.log("[submit-article] Submission successful:", data?.id);
    
    // Send notification email about the submission
    const notificationResult = await sendNotificationEmail(submissionData);
    console.log("[submit-article] Notification email result:", notificationResult);
    
    return createSuccessResponse({
      ...data,
      notification_sent: notificationResult.success,
      notification_message: notificationResult.message
    }, 200, corsHeaders);
    
  } catch (err) {
    logError("[submit-article] Unexpected error", err);
    
    return createErrorResponse(
      'Internal server error', 
      500, 
      corsHeaders, 
      err
    );
  }
});
