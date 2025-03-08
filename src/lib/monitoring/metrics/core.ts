
import { setupPerformanceObservers } from './observers';
import { trackPageView } from './events';
import { forceFlushQueue } from './queue';
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('MetricsCore');

/**
 * Initialize performance tracking
 */
export const initPerformanceTracking = (): () => void => {
  try {
    logger.log('Initializing performance tracking');
    
    // Set up observers
    setupPerformanceObservers();
    
    // Track initial page load
    trackPageView(window.location.pathname);
    
    // Set up flush on page unload
    const handleUnload = () => {
      forceFlushQueue();
    };
    
    // Set up periodic metrics collection
    const periodicCollectionInterval = setInterval(() => {
      trackPageView(window.location.pathname);
    }, 60000); // Every minute
    
    window.addEventListener('unload', handleUnload);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('unload', handleUnload);
      clearInterval(periodicCollectionInterval);
      forceFlushQueue();
    };
    
  } catch (error) {
    logger.error(error, { context: 'initPerformanceTracking' });
    return () => {}; // Empty cleanup function
  }
};
