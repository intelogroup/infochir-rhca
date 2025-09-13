
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackView } from "@/lib/analytics/track";
import { createLogger } from '@/lib/error-logger';
import { DocumentType } from '@/lib/analytics/download/statistics/types';

const logger = createLogger('useAnalytics');

// Generate a random session ID if not already present
const getSessionId = () => {
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const location = useLocation();
  const sessionId = getSessionId();

  // Track page views
  useEffect(() => {
    const trackPageView = async () => {
      const route = location.pathname.split('/')[1] || 'home';
      
      logger.log('[analytics] Tracking view event:', {
        data: {
          route,
          path: location.pathname
        },
        pageUrl: window.location.href
      });
      
      try {
        // Call the tracking function for each page view
        // We're not tracking document-specific views here, so we use a generic DocumentType
        const success = await trackView('page-view', DocumentType.Article);
        if (success) {
          logger.log('[analytics] Successfully tracked view event');
        }
      } catch (error) {
        logger.error('[analytics] Error tracking view event:', error);
      }
    };

    // Only track in production, or if the debug flag is set
    if (import.meta.env.PROD || import.meta.env.VITE_DEBUG_ANALYTICS === 'true') {
      trackPageView();
    }
  }, [location.pathname]);

  // Track when users enter and leave the site
  useEffect(() => {
    logger.log('[analytics] Analytics initialized with session ID:', sessionId);
    
    const handleBeforeUnload = () => {
      // You could track exit events here if needed
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  return { sessionId };
};
