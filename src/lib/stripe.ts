
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";

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
    throw err;
  }
};

// Initialize Stripe
export const stripePromise = getStripePublishableKey()
  .then(key => {
    console.log('[Stripe] Initializing Stripe with publishable key');
    return loadStripe(key);
  })
  .catch(err => {
    console.error('[Stripe] Failed to initialize Stripe:', err);
    return null;
  });
