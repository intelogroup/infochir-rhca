
import * as React from "react";
import { Suspense, useEffect, useState, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminRouteWrapperProps {
  component: React.ComponentType;
  loadingFallback?: React.ReactNode;
}

export const AdminRouteWrapper = ({ 
  component: Component,
  loadingFallback
}: AdminRouteWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

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

  // Clean up resources when unmounting
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Scroll to top when changing admin routes
  useEffect(() => {
    const scrollTimer = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant' as ScrollBehavior
      });
    });
    
    return () => {
      window.cancelAnimationFrame(scrollTimer);
    };
  }, [location.pathname]);

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
      <ErrorBoundary name="admin-route-wrapper" fallback={
        <div className="p-4 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
          <p className="mb-4">Veuillez réessayer plus tard</p>
          <Button onClick={() => navigate('/admin')}>Retour au tableau de bord</Button>
        </div>
      }>
        <Component />
      </ErrorBoundary>
    </Suspense>
  );
};
