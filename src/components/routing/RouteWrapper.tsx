
import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RouteWrapperProps {
  component: React.ComponentType;
}

// Create a simple cache for scroll positions
const scrollPositions = new Map<string, number>();

export const RouteWrapper = ({ component: Component }: RouteWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOffline, setIsOffline] = useState(false);

  // Check for network status and update state
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
    } else {
      window.scrollTo(0, 0); // Always scroll to top for new routes
    }
  }, [location.pathname]);

  // Global error handler for route-level errors
  const handleError = React.useCallback((error: Error) => {
    console.error("Route error:", error);
    
    if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
      toast.error("Erreur de connexion", {
        description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
      });
    } else {
      toast.error("Une erreur est survenue", {
        description: "Veuillez réessayer plus tard"
      });
    }
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

  // Show offline indicator
  if (isOffline) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-yellow-50 p-6 rounded-lg text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Vous êtes hors ligne</h2>
          <p className="mb-4">
            Vérifiez votre connexion Internet et réessayez.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="default"
          >
            Actualiser la page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" />
      </div>
    }>
      <ErrorBoundary name="route-wrapper" fallback={
        <div className="p-4 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
          <p className="mb-4">Veuillez réessayer plus tard</p>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      }>
        {React.createElement(enhancedComponent)}
      </ErrorBoundary>
    </Suspense>
  );
};
