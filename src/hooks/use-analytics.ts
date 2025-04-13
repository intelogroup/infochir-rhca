
import { useEffect } from 'react';
import { initAnalytics, trackPageView } from '@/lib/analytics/track';

/**
 * Hook to initialize analytics and track page views.
 * Use it in the main layout or at the root of the application.
 */
export const useAnalytics = () => {
  useEffect(() => {
    // Initialize analytics
    initAnalytics();
    
    // Track the initial page view
    trackPageView();
    
    // Track page views on route changes
    const handleRouteChange = () => {
      trackPageView();
    };
    
    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
};
