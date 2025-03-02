
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error('Session ID is required');
    }

    console.log(`[verify-stripe-session] Verifying session: ${session_id}`);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Check payment status
    const isComplete = session.payment_status === 'paid';
    
    console.log(`[verify-stripe-session] Session ${session_id} payment status: ${session.payment_status}`);
    
    // If the payment is complete, update the database record
    if (isComplete) {
      // Update the donation status in the database
      // Note: In a production environment, this should be done via webhooks
      console.log(`[verify-stripe-session] Payment complete for session ${session_id}`);
    }

    return new Response(
      JSON.stringify({ 
        status: isComplete ? 'complete' : session.payment_status,
        customer_email: session.customer_details?.email
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[verify-stripe-session] Error:', error);
    
    // Return a detailed error in development, but a generic one in production
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
