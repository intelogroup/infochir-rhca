
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { 
  checkResendApiKey,
  checkDomainVerification
} from "../_shared/email-sender.ts";
import { 
  createSuccessResponse,
  createErrorResponse
} from "../_shared/error-logger.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    console.log("[check-email-config] Testing email configuration");
    
    // Check API key first
    const apiKeyResult = await checkResendApiKey();
    console.log("[check-email-config] API key check result:", apiKeyResult);
    
    if (!apiKeyResult.valid) {
      return createErrorResponse(
        `Resend API key issue: ${apiKeyResult.message}`,
        400,
        corsHeaders
      );
    }
    
    // Check both domains we're using
    const primaryDomainResult = await checkDomainVerification('info-chir.org');
    console.log("[check-email-config] Domain verification result:", primaryDomainResult);
    
    // Include current API key information without exposing the actual key
    const apiKeyInfo = {
      present: !!Deno.env.get("RESEND_API_KEY"),
      keyPrefix: Deno.env.get("RESEND_API_KEY")?.substring(0, 5) + '...',
      lastUpdated: new Date().toISOString()
    };
    
    return createSuccessResponse({
      api_key_status: apiKeyResult,
      primary_domain_status: primaryDomainResult,
      environment: {
        has_api_key: !!Deno.env.get("RESEND_API_KEY"),
        api_key_info: apiKeyInfo,
        runtime: Deno.version.deno
      }
    }, 200, corsHeaders);
    
  } catch (error) {
    console.error("[check-email-config] Error:", error);
    return createErrorResponse(
      `Error checking email configuration: ${error instanceof Error ? error.message : String(error)}`,
      500,
      corsHeaders,
      error
    );
  }
});
