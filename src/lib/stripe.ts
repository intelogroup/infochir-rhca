
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Initialize Stripe with secret from Supabase
export const getStripePublishableKey = async () => {
  try {
    console.log('[Stripe] Fetching publishable key...');
    const { data, error } = await supabase.functions.invoke('get-stripe-pk');
    
    if (error) {
      console.error('[Stripe] Error fetching publishable key:', error);
      throw error;
    }
    
    if (!data?.publishable_key) {
      throw new Error('No publishable key returned from server');
    }
    
    console.log('[Stripe] Successfully retrieved publishable key');
    return data.publishable_key;
  } catch (err) {
    console.error('[Stripe] Failed to get publishable key:', err);
    // Check if error is due to ad blocker or network
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      toast.error("Payment system blocked. Please disable ad blocker if you wish to make a payment.");
    } else {
      toast.error("Payment system temporarily unavailable");
    }
    throw err;
  }
};

// Initialize Stripe lazily - only when needed
let stripePromise: Promise<any> | null = null;

export const initStripe = async () => {
  if (!stripePromise) {
    console.log('[Stripe] Initializing Stripe instance');
    try {
      const key = await getStripePublishableKey();
      console.log('[Stripe] Loading Stripe with publishable key');
      stripePromise = loadStripe(key);
      return stripePromise;
    } catch (err) {
      console.error('[Stripe] Failed to initialize Stripe:', err);
      stripePromise = null; // Reset for retry
      throw err;
    }
  }
  return stripePromise;
};

// Export a function to get Stripe instance rather than the promise directly
export const getStripe = async () => {
  try {
    const stripe = await initStripe();
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }
    return stripe;
  } catch (error) {
    console.error('[Stripe] Error getting Stripe instance:', error);
    throw error;
  }
};

// Handle checkout session creation
export const createCheckoutSession = async (amount: number, metadata: any = {}) => {
  try {
    console.log('[Stripe] Creating checkout session...');
    const { data: sessionData, error: sessionError } = await supabase.functions.invoke('stripe-checkout', {
      body: { amount, metadata }
    });

    if (sessionError) {
      console.error('[Stripe] Session creation error:', sessionError);
      throw sessionError;
    }

    if (!sessionData?.session_id) {
      throw new Error('No session ID returned from server');
    }

    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    return stripe.redirectToCheckout({
      sessionId: sessionData.session_id
    });
  } catch (error) {
    console.error('[Stripe] Checkout session creation failed:', error);
    toast.error("Failed to initialize payment. Please try again later.");
    throw error;
  }
};
