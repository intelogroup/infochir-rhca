
import * as React from "react";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

interface RouteWrapperProps {
  children: React.ReactNode;
}

export const RouteWrapper = ({ children }: RouteWrapperProps) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" />
      </div>
    }>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};
