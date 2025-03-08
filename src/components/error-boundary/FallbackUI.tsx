
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { parseError } from "@/utils/errorHandling";
import { useNavigate } from "react-router-dom";

interface FallbackUIProps {
  error: Error;
  resetErrorBoundary: () => void;
  errorContext?: string;
  showHome?: boolean;
}

export const FallbackUI = ({ 
  error, 
  resetErrorBoundary, 
  errorContext = "application",
  showHome = true
}: FallbackUIProps) => {
  const navigate = useNavigate();
  const errorInfo = parseError(error);
  
  // Customize UI based on error type
  const getErrorTitle = () => {
    switch (errorInfo.type) {
      case 'network_error':
        return "Problème de connexion";
      case 'timeout_error':
        return "Délai d'attente dépassé";
      case 'not_found':
        return "Ressource non trouvée";
      case 'permission_error':
        return "Accès non autorisé";
      default:
        return "Une erreur est survenue";
    }
  };
  
  const getErrorDescription = () => {
    switch (errorInfo.type) {
      case 'network_error':
        return "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
      case 'timeout_error':
        return "Le serveur met trop de temps à répondre. Veuillez réessayer plus tard.";
      case 'not_found':
        return "La ressource demandée n'a pas été trouvée.";
      case 'permission_error':
        return "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.";
      default:
        return errorInfo.message || "Veuillez réessayer ou revenir à l'accueil.";
    }
  };
  
  return (
    <div className="p-4 max-w-xl mx-auto">
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>{getErrorTitle()}</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{getErrorDescription()}</p>
          {errorInfo.details && <p className="text-sm opacity-80">{errorInfo.details}</p>}
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        <Button
          variant="outline"
          onClick={resetErrorBoundary}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Réessayer
        </Button>
        
        {showHome && (
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        )}
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-xs bg-gray-50 p-3 rounded-md">
          <summary className="cursor-pointer font-medium">Détails techniques</summary>
          <div className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-64">
            <p className="font-bold mb-1">Contexte: {errorContext}</p>
            <pre>{error.stack}</pre>
          </div>
        </details>
      )}
    </div>
  );
};
