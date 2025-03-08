
import { createLogger } from "@/lib/error-logger";
import { supabase } from "@/integrations/supabase/client";

const logger = createLogger('ErrorTracking');

// Only track errors in production to avoid flooding the error logs during development
const shouldTrackErrors = import.meta.env.PROD || window.location.hostname !== 'localhost';

// Rate limit error tracking to prevent flooding
const ERROR_RATE_LIMIT = {
  maxErrors: 10,
  timeWindow: 60000, // 1 minute
  errors: new Map<string, number>(),
  lastReset: Date.now(),
};

// Check if we should rate limit this error
const shouldRateLimit = (errorKey: string): boolean => {
  const now = Date.now();
  
  // Reset counters if we're outside the time window
  if (now - ERROR_RATE_LIMIT.lastReset > ERROR_RATE_LIMIT.timeWindow) {
    ERROR_RATE_LIMIT.errors.clear();
    ERROR_RATE_LIMIT.lastReset = now;
  }
  
  // Get current count for this error
  const currentCount = ERROR_RATE_LIMIT.errors.get(errorKey) || 0;
  
  // Update count
  ERROR_RATE_LIMIT.errors.set(errorKey, currentCount + 1);
  
  // Return true if we should rate limit
  return currentCount >= ERROR_RATE_LIMIT.maxErrors;
};

// Create a key for the error to group similar errors
const createErrorKey = (error: Error, context: string): string => {
  return `${context}-${error.name}-${error.message}`;
};

// Function to handle errors from error boundaries
export const handleBoundaryError = async (
  error: Error, 
  errorInfo: { componentStack?: string }, 
  context: string = 'unknown'
): Promise<void> => {
  try {
    // Skip tracking in development unless explicitly enabled
    if (!shouldTrackErrors) {
      console.warn('[Dev mode] Error tracking skipped:', error.message);
      return;
    }
    
    // Create error key for rate limiting
    const errorKey = createErrorKey(error, context);
    
    // Check rate limiting
    if (shouldRateLimit(errorKey)) {
      logger.warn(`Rate limited error: ${errorKey}`);
      return;
    }
    
    // Log to console
    logger.error(`Error in ${context}:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    
    // Get essential info for tracking
    const browserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
    
    // In a real app, you would send this to your error tracking service
    // For now, we'll just save it to Supabase if available
    if (supabase) {
      try {
        await supabase.from('error_events').insert({
          error_name: error.name,
          error_message: error.message,
          error_stack: error.stack,
          component_stack: errorInfo.componentStack,
          context,
          browser_info: browserInfo,
          url: window.location.href,
          created_at: new Date().toISOString(),
        });
      } catch (dbError) {
        // Just log this error, don't try to track it to avoid infinite loops
        console.error('Failed to save error to database:', dbError);
      }
    }
  } catch (trackingError) {
    // If error tracking itself fails, just log to console
    console.error('Error in error tracking:', trackingError);
  }
};
