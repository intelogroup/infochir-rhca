
import * as React from "react";
import { Suspense, useRef, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AdminSecurityProvider } from "@/components/admin/security/AdminSecurityProvider";
import { toast } from "sonner";

interface AdminRouteWrapperProps {
  component: React.ComponentType;
  children: React.ReactNode;
}

export const AdminRouteWrapper = ({ component: Component, children }: AdminRouteWrapperProps) => {
  const { user, isAdmin, isLoading, error, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const hasShownAccessDeniedToast = useRef(false);
  const hasShownAuthErrorToast = useRef(false);

  // Handle authentication errors - show toast only once
  useEffect(() => {
    if (error && !isLoading && !hasShownAuthErrorToast.current) {
      hasShownAuthErrorToast.current = true;
      console.error('[AdminRouteWrapper] Authentication error:', error);
      toast.error("Erreur d'authentification", {
        description: "Veuillez vous reconnecter",
      });
      navigate("/admin/login", { replace: true });
    }
  }, [error, isLoading, navigate]);

  // Show access denied toast only once when user is authenticated but not admin
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !isAdmin && !hasShownAccessDeniedToast.current) {
      hasShownAccessDeniedToast.current = true;
      console.log('[AdminRouteWrapper] User not admin, access denied');
      toast.error("Accès refusé", {
        description: "Vous n'avez pas les droits d'accès à cette page"
      });
    }
  }, [isLoading, isAuthenticated, user, isAdmin]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" text="Vérification des droits d'accès..." />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    console.log('[AdminRouteWrapper] User not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated but not admin, redirect to login
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  console.log('[AdminRouteWrapper] Admin access granted for user:', user.email);

  return (
    <AdminSecurityProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner variant="default" size="lg" />
        </div>
      }>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </Suspense>
    </AdminSecurityProvider>
  );
};
