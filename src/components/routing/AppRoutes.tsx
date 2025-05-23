
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
    
    // Signal that route change is complete
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('route-changed'));
      
      // Preload common sub-routes for the current route
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

  // Function to preload a specific route
  const preloadRoute = (path: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    link.as = 'document';
    
    // Check if this link already exists
    if (!document.head.querySelector(`link[rel="prefetch"][href="${path}"]`)) {
      document.head.appendChild(link);
    }
  };

  // Aggressively preload all routes on initial load
  React.useEffect(() => {
    // Immediately preload all top-level routes
    routes.forEach(route => {
      if (route.path) {
        preloadRoute(route.path);
      }
      
      // Also preload first-level child routes
      if (route.children) {
        route.children.forEach(childRoute => {
          if (childRoute.path && !childRoute.path.includes(':')) {
            // Don't preload dynamic routes with parameters
            const fullPath = route.path 
              ? `${route.path}/${childRoute.path}`.replace('//', '/') 
              : childRoute.path;
            preloadRoute(fullPath);
          }
        });
      }
    });
  }, []);

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
