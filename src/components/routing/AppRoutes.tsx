
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

  return (
    <ErrorBoundary>
      <Routes location={location}>
        {/* Map through defined routes */}
        {routes.map((route) => {
          logger.debug(`Rendering route: ${route.path} (${route.name})`);
          return (
            <Route 
              key={route.path} 
              path={route.path} 
              element={route.element} 
            />
          );
        })}
      </Routes>
    </ErrorBoundary>
  );
};
