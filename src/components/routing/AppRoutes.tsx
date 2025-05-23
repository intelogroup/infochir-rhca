
import * as React from "react";
import { useLocation } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { createLogger } from "@/lib/error-logger";
import { preloadCommonRoutes, preloadRoute } from "@/lib/route-utils";

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
      
      // Context-based route preloading based on current path
      if (location.pathname === '/') {
        preloadRoute('/about');
        preloadRoute('/rhca');
        preloadRoute('/igm');
      } else if (location.pathname === '/rhca') {
        preloadRoute('/rhca/article');
      } else if (location.pathname === '/igm') {
        preloadRoute('/igm/directives');
      }
    }
  }, [location]);

  // Preload all routes on initial load
  React.useEffect(() => {
    preloadCommonRoutes();
  }, []);

  // This component no longer renders routes directly
  return null;
};
