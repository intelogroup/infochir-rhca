
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger("EmailConfigChecker");

export const checkEmailConfiguration = async () => {
  try {
    logger.info("Checking email configuration status");
    
    const { data, error } = await supabase.functions.invoke('check-email-config');
    
    if (error) {
      logger.error('Error checking email config:', error);
      return { success: false, error };
    }
    
    logger.info('Email configuration status:', data);
    return { success: true, data };
    
  } catch (error) {
    logger.error('Exception checking email config:', error);
    return { success: false, error };
  }
};
