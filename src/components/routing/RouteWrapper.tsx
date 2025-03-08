import * as React from "react";
import { Suspense, useEffect, useState, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useScrollToTop } from "@/hooks/useScrollToTop";

interface RouteWrapperProps {
  component: React.ComponentType;
  loadingFallback?: React.ReactNode;
}

// Create a simple cache for scroll positions
const scrollPositions = new Map<string, number>();

export const RouteWrapper = ({ 
  component: Component, 
  loadingFallback 
}: RouteWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);
  const routeTimersRef = useRef<number[]>([]);
  
  // Use enhanced scrollToTop hook
  const { isScrolling } = useScrollToTop(location.key || location.pathname, {
    behavior: 'instant',
    debounceTime: 200
  });

  // Register route-specific timers for cleanup
  const registerRouteTimer = (timerId: number) => {
    routeTimersRef.current.push(timerId);
    
    // Add to global registry for cleanup during route changes
    if (!window.__ROUTE_TIMERS__) {
      window.__ROUTE_TIMERS__ = {};
    }
    
    if (!window.__ROUTE_TIMERS__[location.pathname]) {
      window.__ROUTE_TIMERS__[location.pathname] = [];
    }
    
    window.__ROUTE_TIMERS__[location.pathname].push(timerId);
    
    return timerId;
  };

  // Set loading state with debounce to prevent flicker
  useEffect(() => {
    setIsLoading(true);
    const loadingTimer = window.setTimeout(() => {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }, 300);
    
    return () => {
      window.clearTimeout(loadingTimer);
    };
  }, [location.pathname]);

  // Clean up any component-specific resources when unmounting
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      // Clear any timers registered for this route
      routeTimersRef.current.forEach(timerId => {
        window.clearTimeout(timerId);
      });
      
      // Save scroll position when navigating away
      scrollPositions.set(location.pathname, window.scrollY);
    };
  }, [location.pathname]);

  // Check for network status and update state
  useEffect(() => {
    const handleOnline = () => {
      if (mountedRef.current) {
        setIsOffline(false);
      }
    };
    
    const handleOffline = () => {
      if (mountedRef.current) {
        setIsOffline(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Restore scroll position when returning to a previously visited route
  useEffect(() => {
    const savedPosition = scrollPositions.get(location.pathname);
    
    if (savedPosition) {
      // Use requestAnimationFrame to ensure DOM is ready before scrolling
      const scrollTimer = window.requestAnimationFrame(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'instant' as ScrollBehavior
        });
      });
      
      return () => {
        window.cancelAnimationFrame(scrollTimer);
      };
    } else {
      // Always scroll to top for new routes, but do it after render
      const scrollTimer = window.requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant' as ScrollBehavior
        });
      });
      
      return () => {
        window.cancelAnimationFrame(scrollTimer);
      };
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

  // Custom loading fallback or default spinner
  const renderLoading = () => {
    if (loadingFallback) {
      return loadingFallback;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" />
      </div>
    );
  };

  return (
    <Suspense fallback={renderLoading()}>
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
