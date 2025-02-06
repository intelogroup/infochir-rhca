
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@12.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string);
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') as string,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency, donor_info } = await req.json();
    console.log('Creating checkout session with:', { amount, currency, donor_info });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/donate`,
      metadata: {
        donor_name: donor_info.name,
        donor_email: donor_info.email,
        is_anonymous: donor_info.is_anonymous.toString(),
        message: donor_info.message
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

    console.log('Checkout session created:', session.id);

    // Create pending donation record
    const { error: dbError } = await supabase
      .from('donations')
      .insert([{
        amount,
        currency,
        status: 'pending',
        checkout_session_id: session.id,
        donor_name: donor_info.is_anonymous ? null : donor_info.name,
        donor_email: donor_info.email,
        message: donor_info.message,
        is_anonymous: donor_info.is_anonymous
      }]);

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
