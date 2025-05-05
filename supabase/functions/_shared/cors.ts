
/**
 * CORS utilities for Edge Functions
 */

// Standard CORS headers to allow cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevent caching of edge function responses
};

/**
 * Handles CORS preflight requests
 * @param req The incoming request
 * @returns Response object for OPTIONS requests, null for other methods
 */
export function handleCors(req: Request): Response | null {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      status: 204, // No content
      headers: corsHeaders
    });
  }
  
  // For other methods, continue with request handling
  return null;
}
