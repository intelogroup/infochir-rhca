
import * as React from "react";
import { Suspense, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RouteWrapperProps {
  component: React.ComponentType;
}

export const RouteWrapper = ({ component: Component }: RouteWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Effect to scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ErrorBoundary 
      name={`route-${location.pathname}`} 
      fallback={
        <div className="p-4 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
          <p className="text-gray-600 mb-4">
            Nous nous excusons pour ce désagrément. Veuillez réessayer ou retourner à l'accueil.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
            <Button variant="outline" onClick={() => navigate('/')}>Retour à l'accueil</Button>
          </div>
        </div>
      }
    >
      <Suspense fallback={
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner size="md" />
        </div>
      }>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};
