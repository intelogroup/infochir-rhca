
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useDebugLogger } from "@/hooks/use-debug-logger";

interface AdminAccessGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
  showDebugInfo?: boolean;
}

export const AdminAccessGuard: React.FC<AdminAccessGuardProps> = ({
  children,
  fallbackPath = "/admin/login",
  showDebugInfo = false
}) => {
  const { user, isAdmin, isLoading, error, isAuthenticated } = useAdminAuth();
  const { logError, logWarn, logInfo } = useDebugLogger();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        logWarn('auth', 'User not authenticated, redirecting to login', { fallbackPath });
      } else if (!isAdmin) {
        logWarn('auth', 'User authenticated but not admin', { userId: user?.id, email: user?.email });
      } else {
        logInfo('auth', 'Admin access granted', { userId: user?.id, email: user?.email });
      }
    }

    if (error) {
      logError('auth', 'Authentication error in AdminAccessGuard', { error: error.message }, error);
    }
  }, [isLoading, isAuthenticated, isAdmin, user, error, logError, logWarn, logInfo, fallbackPath]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h2 className="text-lg font-semibold">Vérification des droits d'accès</h2>
              <p className="text-sm text-muted-foreground text-center">
                Validation de votre statut administrateur en cours...
              </p>
              {showDebugInfo && (
                <div className="w-full mt-4 p-3 bg-muted rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Debug Info:</h3>
                  <div className="space-y-1 text-xs">
                    <div>Loading: {isLoading ? 'true' : 'false'}</div>
                    <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
                    <div>Is Admin: {isAdmin ? 'true' : 'false'}</div>
                    <div>User ID: {user?.id || 'N/A'}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle authentication errors
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Erreur d'authentification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Une erreur s'est produite lors de la vérification de vos droits d'accès.
              </p>
              <Badge variant="destructive" className="text-xs">
                {error.message}
              </Badge>
              {showDebugInfo && (
                <div className="p-3 bg-muted rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Debug Info:</h3>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify({
                      error: error.message,
                      stack: error.stack?.split('\n').slice(0, 3)
                    }, null, 2)}
                  </pre>
                </div>
              )}
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  size="sm"
                >
                  Réessayer
                </Button>
                <Button 
                  onClick={() => window.location.href = fallbackPath} 
                  size="sm"
                >
                  Retour à la connexion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Shield className="h-5 w-5" />
              Accès refusé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Vous n'avez pas les droits d'administrateur nécessaires pour accéder à cette page.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Utilisateur:</span>
                  <Badge variant="secondary">{user.email}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Statut:</span>
                  <Badge variant="destructive">Non-administrateur</Badge>
                </div>
              </div>
              {showDebugInfo && (
                <div className="p-3 bg-muted rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Debug Info:</h3>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify({
                      userId: user.id,
                      email: user.email,
                      isAdmin,
                      isAuthenticated
                    }, null, 2)}
                  </pre>
                </div>
              )}
              <Button 
                onClick={() => window.location.href = "/"} 
                className="w-full"
              >
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Grant access to admin
  return <>{children}</>;
};
