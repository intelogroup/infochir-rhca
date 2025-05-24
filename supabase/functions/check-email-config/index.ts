
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { checkResendApiKey, checkDomainVerification } from "../_shared/email-sender.ts";
import { createSuccessResponse, createErrorResponse } from "../_shared/error-logger.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }
  
  try {
    console.log("[check-email-config] Testing email configuration");
    
    // Check API key status
    const apiKeyStatus = await checkResendApiKey();
    console.log("[check-email-config] API key check result:", apiKeyStatus);
    
    // Check primary domain verification (info-chir.org)
    const primaryDomainStatus = await checkDomainVerification("info-chir.org");
    console.log("[check-email-config] Domain verification result:", primaryDomainStatus);
    
    // Check environment variables
    const envCheck = {
      resend_api_key: !!Deno.env.get("RESEND_API_KEY"),
      supabase_url: !!Deno.env.get("SUPABASE_URL"),
      supabase_anon_key: !!Deno.env.get("SUPABASE_ANON_KEY"),
      supabase_service_role_key: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    };
    
    console.log("[check-email-config] Environment variables check:", envCheck);
    
    const configStatus = {
      api_key_status: apiKeyStatus,
      primary_domain_status: primaryDomainStatus,
      environment_variables: envCheck,
      overall_status: apiKeyStatus.valid && envCheck.resend_api_key ? "READY" : "CONFIGURATION_NEEDED",
      recommendations: []
    };
    
    // Generate recommendations
    if (!apiKeyStatus.valid) {
      configStatus.recommendations.push({
        type: "critical",
        message: "Configure valid Resend API key",
        action: "Add RESEND_API_KEY secret in Supabase Edge Functions settings"
      });
    }
    
    if (!primaryDomainStatus.verified) {
      configStatus.recommendations.push({
        type: "warning",
        message: "Domain not verified - using Resend default domain",
        action: "Verify info-chir.org domain in Resend dashboard for better deliverability"
      });
    }
    
    if (!envCheck.supabase_url || !envCheck.supabase_anon_key) {
      configStatus.recommendations.push({
        type: "critical",
        message: "Missing Supabase configuration",
        action: "Ensure SUPABASE_URL and SUPABASE_ANON_KEY are properly set"
      });
    }
    
    return createSuccessResponse(configStatus, 200, corsHeaders);
    
  } catch (error) {
    console.error("[check-email-config] Error checking configuration:", error);
    return createErrorResponse(
      "Failed to check email configuration",
      500,
      corsHeaders,
      error
    );
  }
});
