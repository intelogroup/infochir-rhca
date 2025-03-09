
import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { RouteWrapper } from "./RouteWrapper";
import { AdminRouteWrapper } from "./AdminRouteWrapper";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { routes } from "@/config/routes";

// Import pages directly rather than from routes
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import TriggerUploads from "@/pages/TriggerUploads";

export const AppRoutes = () => {
  const location = useLocation();
  useScrollToTop();

  return (
    <ErrorBoundary>
      <Routes location={location}>
        {/* Map through defined routes */}
        {routes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element} 
          />
        ))}
      </Routes>
    </ErrorBoundary>
  );
};
