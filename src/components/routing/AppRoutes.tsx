
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
    }
  }, [location]);

  // Preload components for immediate routes when app first loads
  React.useEffect(() => {
    // Preload all top-level routes immediately
    const preloadTopLevelRoutes = () => {
      routes.forEach(route => {
        if (route.element) {
          // Just accessing the element property triggers preload for lazy components
          const _ = route.element;
        }
      });
    };
    
    // Run preloading immediately on mount
    preloadTopLevelRoutes();
    
    // Also preload when idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        routes.forEach(route => {
          if (route.children) {
            route.children.forEach(childRoute => {
              if (childRoute.element) {
                const _ = childRoute.element;
              }
            });
          }
        });
      });
    }
  }, []);

  // Preload next likely routes based on current route
  React.useEffect(() => {
    // Preload related routes when a specific route is active
    const preloadRelatedRoutes = () => {
      // Home -> About, RHCA, IGM are common paths
      if (location.pathname === '/') {
        ['about', 'rhca', 'igm'].forEach(path => {
          const route = routes[0]?.children?.find(r => r.path === path);
          if (route && route.element) {
            const _ = route.element;
          }
        });
      }
      
      // RHCA -> RHCA article detail is a common path
      if (location.pathname === '/rhca') {
        const route = routes[0]?.children?.find(r => r.path === 'rhca/article/:id');
        if (route && route.element) {
          const _ = route.element;
        }
      }
    };
    
    // Use requestIdleCallback for non-critical preloading
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadRelatedRoutes, { timeout: 2000 });
    } else {
      // Fallback to setTimeout with a short delay
      setTimeout(preloadRelatedRoutes, 500);
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
