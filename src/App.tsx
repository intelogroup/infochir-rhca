
import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { NetworkStatusMonitor } from "@/components/error-boundary/NetworkStatusMonitor";
import { GenericErrorBoundary } from "@/components/error-boundary/GenericErrorBoundary";
import { FallbackUI } from "@/components/error-boundary/FallbackUI";
import { prefetchQueries, queryClient } from "@/lib/react-query";
import { checkSupabaseConnection, prefetchCommonData } from "@/integrations/supabase/client";
import "@/App.css";

function App() {
  // Prefetch important application data when the app loads
  useEffect(() => {
    // Attempt to prefetch common data
    const prefetchData = async () => {
      try {
        // First check if we have a connection to Supabase
        const isConnected = await checkSupabaseConnection();
        
        if (isConnected) {
          // Prefetch data in parallel
          await Promise.all([
            prefetchQueries(),
            prefetchCommonData()
          ]);
          console.log("Successfully prefetched application data");
        } else {
          console.warn("Skipping data prefetch due to connection issues");
        }
      } catch (error) {
        console.error("Error prefetching data:", error);
        // We don't show an error toast here as it would be disruptive on app load
        // Instead, individual components will handle their own data fetching errors
      }
    };

    // Add event listener to refetch stale data when the tab becomes visible again
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const staleCacheKeys = Array.from(queryClient.getQueryCache().queries)
          .filter(query => query.state.status === 'success' && query.isStale())
          .map(query => query.queryKey);
          
        if (staleCacheKeys.length > 0) {
          console.log("Refetching stale queries on tab focus:", staleCacheKeys.length);
          
          // Refetching in the background without blocking rendering
          setTimeout(() => {
            staleCacheKeys.forEach(key => {
              queryClient.refetchQueries({ queryKey: key, exact: true });
            });
          }, 100);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    prefetchData();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
