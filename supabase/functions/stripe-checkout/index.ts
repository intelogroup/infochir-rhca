
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@12.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16', // Specify API version
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') as string,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
);

// Helper function to validate request body
const validateRequestBody = (body: any) => {
  if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
    throw new Error("Invalid donation amount");
  }
  
  if (!body.currency || typeof body.currency !== 'string') {
    throw new Error("Invalid currency");
  }
  
  if (!body.donor_info || !body.donor_info.email) {
    throw new Error("Donor email is required");
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.donor_info.email)) {
    throw new Error("Invalid email format");
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate request body
    try {
      validateRequestBody(body);
    } catch (validationError: any) {
      console.error('[Stripe Checkout] Validation error:', validationError.message);
      return new Response(
        JSON.stringify({ error: validationError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { amount, currency = 'usd', donor_info } = body;
    console.log('[Stripe Checkout] Request received:', { amount, currency });
    console.log('[Stripe Checkout] Donor info:', donor_info);

    // Create Stripe Checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/donate`,
        metadata: {
          donor_name: donor_info.name || '',
          donor_email: donor_info.email,
          is_anonymous: donor_info.is_anonymous.toString(),
          message: donor_info.message || ''
        },
        line_items: [{
          price_data: {
            currency,
            product_data: {
              name: 'Donation to INFOCHIR',
              description: 'Thank you for your support',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        }],
      });

      console.log('[Stripe Checkout] Session created:', session.id);

      // Create donation record - log the exact data being inserted
      const donationData = {
        amount,
        currency,
        status: 'pending',
        checkout_session_id: session.id,
        donor_name: donor_info.is_anonymous ? null : donor_info.name,
        donor_email: donor_info.email,
        message: donor_info.message || null,
        is_anonymous: donor_info.is_anonymous
      };

      console.log('[Stripe Checkout] Creating donation record:', donationData);

      // Save to database with proper error handling
      try {
        const { error: dbError } = await supabase
          .from('donations')
          .insert([donationData]);

        if (dbError) {
          console.error('[Stripe Checkout] Database error:', dbError);
          // We can still return session ID even if DB insert fails
          // Just log the error but continue
          console.log('[Stripe Checkout] Will continue despite DB error, payment can still be processed');
        } else {
          console.log('[Stripe Checkout] Donation record created successfully');
        }
      } catch (dbError) {
        console.error('[Stripe Checkout] Unhandled database error:', dbError);
        // Continue with checkout even if DB fails
      }

      return new Response(
        JSON.stringify({ session_id: session.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (stripeError: any) {
      console.error('[Stripe Checkout] Stripe error:', stripeError);
      return new Response(
        JSON.stringify({ 
          error: "Payment processing error",
          details: stripeError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('[Stripe Checkout] Unhandled error:', error);
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
