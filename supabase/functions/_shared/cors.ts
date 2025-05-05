
/**
 * CORS utilities for Edge Functions
 */

// Enhanced CORS headers to allow cross-origin requests with better compatibility
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, content-length, content-type, range, accept, origin, referer, user-agent',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
  'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevent caching of edge function responses
};

/**
 * Handles CORS preflight requests with enhanced logging
 * @param req The incoming request
 * @returns Response object for OPTIONS requests, null for other methods
 */
export function handleCors(req: Request): Response | null {
  // Enhanced CORS preflight handler with detailed logging
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request from origin:", req.headers.get('origin'));
    
    // Check for required CORS headers and log if missing
    if (!req.headers.get('access-control-request-method')) {
      console.warn("Missing access-control-request-method header in CORS preflight");
    }
    
    return new Response(null, {
      status: 204, // No content
      headers: {
        ...corsHeaders,
        // Add origin-specific header if available
        ...(req.headers.get('origin') ? {
          'Access-Control-Allow-Origin': req.headers.get('origin') || '*'
        } : {})
      }
    });
  }
  
  // For non-OPTIONS methods, just continue with normal handling
  return null;
}
