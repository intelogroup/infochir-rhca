
import * as React from "react";
import { Suspense, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RouteWrapperProps {
  component: React.ComponentType;
}

export const RouteWrapper = ({ component: Component }: RouteWrapperProps) => {
  const navigate = useNavigate();

  // Global error handler for route-level errors
  const handleError = React.useCallback((error: Error) => {
    console.error("Route error:", error);
    toast.error("Une erreur est survenue", {
      description: "Veuillez réessayer plus tard"
    });
  }, []);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" />
      </div>
    }>
      <ErrorBoundary onError={handleError}>
        <Component />
      </ErrorBoundary>
    </Suspense>
  );
};
