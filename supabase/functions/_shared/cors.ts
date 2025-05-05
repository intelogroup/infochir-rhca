
// CORS headers to allow cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-client-mode',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours caching of preflight requests
};

/**
 * Handle CORS preflight requests
 * @param req The incoming request
 * @returns A Response for OPTIONS requests or null for other methods
 */
export function handleCors(req: Request): Response | null {
  // Log the origin in preflight requests for debugging
  const origin = req.headers.get('Origin');
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request from origin:', origin);
    
    // Return response with CORS headers for preflight requests
    return new Response(null, {
      status: 204, // No content needed for preflight
      headers: corsHeaders,
    });
  }
  
  // Log the origin for non-preflight requests as well
  if (origin) {
    console.log('Request from origin:', origin);
  }
  
  // Return null for non-preflight requests
  return null;
}
