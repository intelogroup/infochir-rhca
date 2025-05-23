
import * as React from "react";
import { useLocation } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { createLogger } from "@/lib/error-logger";
import { preloadCommonRoutes, handleRouteChange, preloadRoute } from "@/lib/route-utils";

// Create a logger for routes
const logger = createLogger('AppRoutes');

export const AppRoutes = () => {
  const location = useLocation();
  useScrollToTop();

  // Log the current route for debugging
  React.useEffect(() => {
    logger.info(`Route changed to: ${location.pathname}`);
    
    // Signal that route change is complete
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('route-changed'));
      
      // Context-based route preloading
      if (location.pathname === '/') {
        // From Home, users often go to About, RHCA or IGM
        preloadRoute('/about');
        preloadRoute('/rhca');
        preloadRoute('/igm');
      } else if (location.pathname === '/rhca') {
        // From RHCA, users often go to article details
        preloadRoute('/rhca/article');
      } else if (location.pathname === '/igm') {
        // From IGM, users often go to details or directives
        preloadRoute('/igm/directives');
      }
    }
  }, [location]);

  // Aggressively preload all routes on initial load
  React.useEffect(() => {
    // Immediately preload all common routes
    preloadCommonRoutes();
  }, []);

  return null; // This component no longer renders routes directly
};
