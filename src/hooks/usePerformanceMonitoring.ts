
import { useEffect, useRef } from 'react';
import { initPerformanceTracking, trackPageView } from '@/lib/monitoring/metrics';
import { setupGlobalErrorHandlers } from '@/lib/monitoring/error-tracking';
import { useLocation } from 'react-router-dom';
import { createLogger } from '@/lib/error-logger';

const logger = createLogger('usePerformanceMonitoring');

/**
 * React hook to initialize performance monitoring
 */
export const usePerformanceMonitoring = () => {
  const location = useLocation();
  const cleanup = useRef<() => void>(() => {});
  const initialized = useRef(false);
  
  // One-time initialization
  useEffect(() => {
    if (initialized.current) return;
    
    try {
      logger.log('Initializing performance monitoring');
      
      // Set up global error handlers
      setupGlobalErrorHandlers();
      
      // Initialize performance tracking and get cleanup function
      cleanup.current = initPerformanceTracking();
      
      initialized.current = true;
    } catch (error) {
      logger.error(error, { context: 'usePerformanceMonitoring:init' });
    }
    
    // Cleanup on unmount
    return () => {
      try {
        cleanup.current();
      } catch (error) {
        logger.error(error, { context: 'usePerformanceMonitoring:cleanup' });
      }
    };
  }, []);
  
  // Track page views on route changes
  useEffect(() => {
    if (!initialized.current) return;
    
    try {
      const { pathname } = location;
      
      logger.log('Page changed, tracking metrics', { pathname });
      trackPageView(pathname);
    } catch (error) {
      logger.error(error, { context: 'usePerformanceMonitoring:pageTracking' });
    }
  }, [location]);
  
  return { initialized: initialized.current };
};
