
// Updated CORS configuration to ensure proper cross-origin access
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://info-chir.org',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-client-mode, x-client-info, x-client',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours cache for preflight requests
  'Cache-Control': 'public, max-age=3600' // 1 hour cache for responses
}

// Helper function to handle CORS preflight requests
export function handleCors(req: Request) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }
  
  return null;
}
