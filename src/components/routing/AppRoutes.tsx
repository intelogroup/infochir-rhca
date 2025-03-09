
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
