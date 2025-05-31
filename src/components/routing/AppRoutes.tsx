
import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { AppRoutes as Routes_Component } from "@/config/routes";
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

  return (
    <ErrorBoundary>
      <Routes_Component />
    </ErrorBoundary>
  );
};
