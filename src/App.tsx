
import * as React from "react";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Use dynamic import with prefetch for the AppRoutes component
const AppRoutes = lazy(() => {
  // Prefetch important chunks
  import("@/config/routes");
  
  return import("@/components/routing/AppRoutes").then(module => ({
    default: module.AppRoutes
  }));
});

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner variant="default" size="lg" />
        </div>
      }>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
