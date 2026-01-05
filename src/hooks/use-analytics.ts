
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from "@/lib/analytics/track";
import { getSessionId } from '@/lib/analytics/session';
import { createLogger } from '@/lib/error-logger';

const logger = createLogger('useAnalytics');

export const useAnalytics = () => {
  const location = useLocation();
  const sessionId = getSessionId();

  // Track page views on route changes
  useEffect(() => {
    const trackCurrentPage = async () => {
      const route = location.pathname;
      
      logger.log('[analytics] Tracking page view:', {
        route,
        path: location.pathname,
        sessionId
      });
      
      try {
        // Only track in production, or if the debug flag is set
        if (import.meta.env.PROD || import.meta.env.VITE_DEBUG_ANALYTICS === 'true') {
          const success = await trackPageView(route);
          if (success) {
            logger.log('[analytics] Successfully tracked page view');
          }
        }
      } catch (error) {
        logger.error('[analytics] Error tracking page view:', error);
      }
    };

    trackCurrentPage();
  }, [location.pathname, sessionId]);

  // Track session start
  useEffect(() => {
    logger.log('[analytics] Analytics initialized with session ID:', sessionId);
    
    const handleBeforeUnload = () => {
      // Could track exit events here if needed
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  return { sessionId };
};
