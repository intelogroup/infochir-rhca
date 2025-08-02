
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { checkResendApiKey } from "../_shared/email-sender.ts";
import { logError, createErrorResponse, createSuccessResponse } from "../_shared/error-logger.ts";

// Input validation constants
const MAX_TITLE_LENGTH = 500;
const MAX_ABSTRACT_LENGTH = 5000;
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 100;
const ALLOWED_PUBLICATION_TYPES = ['research_article', 'review', 'case_study', 'editorial', 'letter'];

// Rate limiting constants
const SUBMISSION_RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_HOURS = 1;

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
    console.log("[submit-article] === STARTING EMAIL NOTIFICATION ===");
    console.log("- Submission ID:", submissionData.id);
    console.log("- Title:", submissionData.title);
    console.log("- User email:", submissionData.corresponding_author_email);
    
    // Check if Resend API key is valid
    console.log("[submit-article] Checking email configuration...");
    const apiKeyCheck = await checkResendApiKey();
    console.log("[submit-article] API key check result:", apiKeyCheck);
    
    if (!apiKeyCheck.valid) {
      console.error("[submit-article] Email configuration issue:", apiKeyCheck.message);
      return {
        success: false,
        message: apiKeyCheck.message
      };
    }
    
    // Prepare the notification URL
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !anonKey) {
      console.error("[submit-article] Missing Supabase configuration");
      return {
        success: false,
        message: "Missing Supabase configuration for email notification"
      };
    }
    
    console.log("[submit-article] Environment variables check:");
    console.log("- SUPABASE_URL:", supabaseUrl);
    console.log("- SUPABASE_ANON_KEY present:", !!anonKey);
    
    const notifyUrl = `${supabaseUrl}/functions/v1/notify-submission`;
    console.log("[submit-article] Calling notification endpoint:", notifyUrl);
    
    // Call the notification edge function
    const notifyResponse = await fetch(notifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'x-client-info': 'submit-article/1.0.0'
      },
      body: JSON.stringify(submissionData)
    });
    
    console.log("[submit-article] Notification response received:");
    console.log("- Status:", notifyResponse.status);
    console.log("- Status text:", notifyResponse.statusText);
    console.log("- Headers:", Object.fromEntries(notifyResponse.headers.entries()));
    
    // Get response data as text first for debugging
    const responseText = await notifyResponse.text();
    console.log("[submit-article] Raw response:", responseText);
    
    // Parse the text as JSON if possible
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log("[submit-article] Parsed response data:", responseData);
    } catch (parseError) {
      console.error("[submit-article] Failed to parse response as JSON:", parseError);
      console.error("[submit-article] Response text was:", responseText);
      return {
        success: false,
        message: `Invalid response from notification service: ${responseText.substring(0, 200)}`
      };
    }
    
    if (!notifyResponse.ok) {
      console.error("[submit-article] Notification request failed:");
      console.error("- Status:", notifyResponse.status);
      console.error("- Response:", responseData);
      return {
        success: false,
        message: responseData.error || `HTTP ${notifyResponse.status}: ${notifyResponse.statusText}`
      };
    }
    
    console.log("[submit-article] ✅ Email notification completed successfully");
    console.log("- Notification results:", responseData.results);
    
    return {
      success: true,
      message: responseData.message || "Notification sent successfully",
      details: responseData
    };
  } catch (error) {
    console.error("[submit-article] ❌ Critical error in email notification:");
    console.error("- Error message:", error.message);
    console.error("- Error stack:", error.stack);
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
    console.log("[submit-article] === ARTICLE SUBMISSION STARTED ===");
    console.log("- Request method:", req.method);
    console.log("- Request headers:", Object.fromEntries(req.headers.entries()));
    
    // Get the submission data from the request
    const submissionData = await req.json();
    
    // Log the submission attempt
    console.log("[submit-article] Received submission request:");
    console.log("- Title:", submissionData.title);
    console.log("- Publication type:", submissionData.publication_type);
    console.log("- User ID:", submissionData.user_id || 'anonymous');
    console.log("- Author name:", submissionData.corresponding_author_name);
    console.log("- Author email:", submissionData.corresponding_author_email);
    console.log("- Article files count:", submissionData.article_files_urls?.length || 0);
    console.log("- Image annexes count:", submissionData.image_annexes_urls?.length || 0);
    
    // Enhanced input validation and sanitization
    const validationErrors = [];
    
    // Check required fields
    const requiredFields = ['title', 'authors', 'abstract', 'publication_type', 'corresponding_author_email', 'corresponding_author_name'];
    for (const field of requiredFields) {
      if (!submissionData[field] || submissionData[field].toString().trim() === '') {
        validationErrors.push(`${field} is required`);
      }
    }
    
    // Validate field lengths and formats
    if (submissionData.title && submissionData.title.length > MAX_TITLE_LENGTH) {
      validationErrors.push(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
    }
    
    if (submissionData.abstract && submissionData.abstract.length > MAX_ABSTRACT_LENGTH) {
      validationErrors.push(`Abstract must be less than ${MAX_ABSTRACT_LENGTH} characters`);
    }
    
    if (submissionData.corresponding_author_email) {
      if (submissionData.corresponding_author_email.length > MAX_EMAIL_LENGTH) {
        validationErrors.push(`Email must be less than ${MAX_EMAIL_LENGTH} characters`);
      }
      // Basic email validation
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(submissionData.corresponding_author_email)) {
        validationErrors.push('Invalid email format');
      }
    }
    
    if (submissionData.corresponding_author_name && submissionData.corresponding_author_name.length > MAX_NAME_LENGTH) {
      validationErrors.push(`Author name must be less than ${MAX_NAME_LENGTH} characters`);
    }
    
    if (submissionData.publication_type && !ALLOWED_PUBLICATION_TYPES.includes(submissionData.publication_type)) {
      validationErrors.push(`Invalid publication type. Allowed: ${ALLOWED_PUBLICATION_TYPES.join(', ')}`);
    }
    
    // Validate arrays
    if (submissionData.article_files_urls && submissionData.article_files_urls.length > 10) {
      validationErrors.push('Maximum 10 article files allowed');
    }
    
    if (submissionData.image_annexes_urls && submissionData.image_annexes_urls.length > 20) {
      validationErrors.push('Maximum 20 image annexes allowed');
    }
    
    if (validationErrors.length > 0) {
      console.error(`[submit-article] Validation errors:`, validationErrors);
      
      // Log security event for invalid submission attempt
      await supabaseAdmin.rpc('log_security_event', {
        event_type_param: 'invalid_submission_attempt',
        event_data_param: { 
          errors: validationErrors,
          email: submissionData.corresponding_author_email,
          ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
        },
        ip_address_param: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent_param: req.headers.get('user-agent')
      });
      
      return createErrorResponse(
        `Validation failed: ${validationErrors.join(', ')}`,
        400, 
        corsHeaders
      );
    }
    
    console.log("[submit-article] ✅ Validation passed, inserting submission");
    console.log("[submit-article] Database configuration:");
    console.log("- SUPABASE_URL:", Deno.env.get('SUPABASE_URL'));
    console.log("- SERVICE_ROLE_KEY present:", !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    
    // Insert the submission with admin privileges (bypassing RLS)
    const { data, error } = await supabaseAdmin
      .from('article_submissions')
      .insert(submissionData)
      .select()
      .single();
      
    if (error) {
      console.error("[submit-article] ❌ Database insertion failed:");
      console.error("- Error code:", error.code);
      console.error("- Error message:", error.message);
      console.error("- Error details:", JSON.stringify(error, null, 2));
      
      return createErrorResponse(
        error.message,
        500, 
        corsHeaders, 
        error
      );
    }
    
    console.log("[submit-article] ✅ Submission inserted successfully:");
    console.log("- Submission ID:", data?.id);
    console.log("- Created at:", data?.created_at);
    
    // Send notification email about the submission
    console.log("[submit-article] Starting email notification process...");
    const notificationResult = await sendNotificationEmail(submissionData);
    console.log("[submit-article] Email notification completed:", {
      success: notificationResult.success,
      message: notificationResult.message
    });
    
    // Prepare final response
    const response = {
      ...data,
      notification_sent: notificationResult.success,
      notification_message: notificationResult.message,
      notification_details: notificationResult.details
    };
    
    console.log("[submit-article] === SUBMISSION PROCESS COMPLETED ===");
    console.log("- Database insertion: SUCCESS");
    console.log("- Email notification:", notificationResult.success ? "SUCCESS" : "FAILED");
    console.log("- Final response prepared");
    
    return createSuccessResponse(response, 200, corsHeaders);
    
  } catch (err) {
    console.error("[submit-article] ❌ UNEXPECTED ERROR:");
    console.error("- Error message:", err.message);
    console.error("- Error stack:", err.stack);
    logError("[submit-article] Unexpected error", err);
    
    return createErrorResponse(
      'Internal server error', 
      500, 
      corsHeaders, 
      err
    );
  }
});
