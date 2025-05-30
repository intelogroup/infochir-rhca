
import * as React from "react";
import { Suspense } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { toast } from "sonner";

interface AdminRouteWrapperProps {
  component: React.ComponentType;
}

export const AdminRouteWrapper = ({ component: Component }: AdminRouteWrapperProps) => {
  const { user, isAdmin, isLoading, error, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Handle authentication errors
  React.useEffect(() => {
    if (error) {
      toast.error("Erreur d'authentification", {
        description: "Veuillez vous reconnecter",
      });
      navigate("/admin/login", { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" text="Vérification des droits d'accès..." />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    toast.error("Accès refusé", {
      description: "Vous n'avez pas les droits d'accès à cette page"
    });
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" />
      </div>
    }>
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>
    </Suspense>
  );
};
