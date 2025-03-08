
import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { NetworkStatusMonitor } from "@/components/error-boundary/NetworkStatusMonitor";
import { GenericErrorBoundary } from "@/components/error-boundary/GenericErrorBoundary";
import { FallbackUI } from "@/components/error-boundary/FallbackUI";
import { prefetchQueries } from "@/lib/react-query";
import "@/App.css";

function App() {
  // Prefetch important application data when the app loads
  useEffect(() => {
    // Attempt to prefetch common data
    const prefetchData = async () => {
      try {
        await prefetchQueries();
        console.log("Successfully prefetched application data");
      } catch (error) {
        console.error("Error prefetching data:", error);
        // We don't show an error toast here as it would be disruptive on app load
        // Instead, individual components will handle their own data fetching errors
      }
    };

    prefetchData();
  }, []);

  return (
    <GenericErrorBoundary
      errorContext="app-root"
      fallbackRenderer={({ error, resetErrorBoundary }) => (
        <div className="min-h-screen grid place-items-center p-4">
          <FallbackUI
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            errorContext="app-root"
            showHome={false}
          />
        </div>
      )}
    >
      <NetworkStatusMonitor>
        <Router>
          <AppRoutes />
          <Toaster richColors position="top-right" closeButton />
        </Router>
      </NetworkStatusMonitor>
    </GenericErrorBoundary>
  );
}

export default App;
