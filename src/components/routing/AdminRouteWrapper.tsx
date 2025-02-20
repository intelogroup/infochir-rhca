
import * as React from "react";
import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useAdminAuth } from "@/hooks/use-admin-auth";

interface AdminRouteWrapperProps {
  component: React.ComponentType;
}

export const AdminRouteWrapper = ({ component: Component }: AdminRouteWrapperProps) => {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>
    </Suspense>
  );
};
