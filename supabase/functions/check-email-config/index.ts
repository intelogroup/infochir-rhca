
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
    // Check API key first
    const apiKeyResult = await checkResendApiKey();
    
    if (!apiKeyResult.valid) {
      return createErrorResponse(
        `Resend API key issue: ${apiKeyResult.message}`,
        400,
        corsHeaders
      );
    }
    
    // Check both domains we're using
    const primaryDomainResult = await checkDomainVerification('info-chir.org');
    
    return createSuccessResponse({
      api_key_status: apiKeyResult,
      primary_domain_status: primaryDomainResult,
      environment: {
        has_api_key: !!Deno.env.get("RESEND_API_KEY"),
        runtime: Deno.version.deno
      }
    }, 200, corsHeaders);
    
  } catch (error) {
    return createErrorResponse(
      `Error checking email configuration: ${error instanceof Error ? error.message : String(error)}`,
      500,
      corsHeaders,
      error
    );
  }
});
