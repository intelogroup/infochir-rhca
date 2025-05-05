
import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { routes } from "@/config/routes";
import { createLogger } from "@/lib/error-logger";

// Create a logger for routes
const logger = createLogger('AppRoutes');

export const AppRoutes = () => {
  const location = useLocation();
  useScrollToTop();

  // Log the current route for debugging
  React.useEffect(() => {
    logger.info(`Route changed to: ${location.pathname}`);
  }, [location]);

  // Preload components when possible to improve performance
  React.useEffect(() => {
    // Attempt to preload next likely routes based on current route
    const preloadNextRoutes = () => {
      // This is a simple example; could be expanded based on navigation patterns
      if (location.pathname === '/') {
        // Preload common routes from home page
        routes.forEach(route => {
          if (['about', 'rhca', 'igm'].includes(route.path)) {
            // Just accessing the element property triggers preload
            const _ = route.element;
          }
        });
      }
    };
    
    // Use requestIdleCallback for non-critical preloading if available
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadNextRoutes);
    } else {
      // Fallback to setTimeout
      setTimeout(preloadNextRoutes, 1000);
    }
  }, [location.pathname]);

  const renderRoutes = (routes: any[]) => {
    return routes.map((route) => {
      if (route.children) {
        return (
          <Route key={route.path || 'root'} path={route.path} element={route.element}>
            {renderRoutes(route.children)}
          </Route>
        );
      }
      
      return (
        <Route 
          key={route.path} 
          path={route.path} 
          element={route.element} 
        />
      );
    });
  };

  return (
    <ErrorBoundary>
      <Routes location={location}>
        {renderRoutes(routes)}
      </Routes>
    </ErrorBoundary>
  );
};
