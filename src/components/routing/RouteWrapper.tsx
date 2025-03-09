
import * as React from "react";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RouteWrapperProps {
  component: React.ComponentType;
}

export const RouteWrapper = ({ component: Component }: RouteWrapperProps) => {
  const navigate = useNavigate();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[50vh]">
        <LoadingSpinner size="md" />
      </div>
    }>
      <ErrorBoundary name="route" fallback={
        <div className="p-4 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      }>
        <Component />
      </ErrorBoundary>
    </Suspense>
  );
};
