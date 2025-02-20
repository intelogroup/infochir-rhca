
import * as React from "react";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { AppRoutes } from "@/components/routing/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppRoutes />
        <Toaster />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
