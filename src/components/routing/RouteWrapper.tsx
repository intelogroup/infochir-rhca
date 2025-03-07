
import * as React from "react";
import { Suspense, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface RouteWrapperProps {
  component: React.ComponentType;
}

// Create a simple cache for scroll positions
const scrollPositions = new Map<string, number>();

export const RouteWrapper = ({ component: Component }: RouteWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Save scroll position when navigating away from the route
  useEffect(() => {
    return () => {
      scrollPositions.set(location.pathname, window.scrollY);
    };
  }, [location.pathname]);

  // Restore scroll position when returning to a previously visited route
  useEffect(() => {
    const savedPosition = scrollPositions.get(location.pathname);
    if (savedPosition) {
      window.scrollTo(0, savedPosition);
    }
  }, [location.pathname]);

  // Global error handler for route-level errors
  const handleError = React.useCallback((error: Error) => {
    console.error("Route error:", error);
    toast.error("Une erreur est survenue", {
      description: "Veuillez réessayer plus tard"
    });
  }, []);

  // Use sessionStorage to persist form input state between navigations
  const enhancedComponent = React.useMemo(() => {
    const EnhancedComponent = () => {
      // This adds the current route to the browser's history for proper back/forward navigation
      useEffect(() => {
        const state = window.history.state;
        if (!state || !state.key) {
          window.history.replaceState(
            { key: location.key || Math.random().toString(36).substr(2, 8) },
            '',
            location.pathname + location.search
          );
        }
      }, []);

      return <Component />;
    };
    return EnhancedComponent;
  }, [Component, location]);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" />
      </div>
    }>
      <ErrorBoundary name="route-wrapper" fallback={
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
          <p className="mb-4">Veuillez réessayer plus tard</p>
        </div>
      }>
        {React.createElement(enhancedComponent)}
      </ErrorBoundary>
    </Suspense>
  );
};
