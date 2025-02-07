
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";

// Initialize Stripe with secret from Supabase
export const getStripePublishableKey = async () => {
  const { data, error } = await supabase.functions.invoke('get-stripe-pk');
  if (error) throw error;
  return data.publishable_key;
};

// Initialize Stripe
export const stripePromise = getStripePublishableKey().then(key => loadStripe(key));

