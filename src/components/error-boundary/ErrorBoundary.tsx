
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log("[ErrorBoundary] Initializing");
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error("[ErrorBoundary] getDerivedStateFromError:", {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Error caught:", {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name,
      componentStack: errorInfo.componentStack,
      errorInfo
    });

    // Enhanced error logging for chunk loading failures
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      console.error("[ErrorBoundary] Chunk loading error detected:", {
        currentRoute: window.location.pathname,
        networkState: navigator.onLine ? 'online' : 'offline',
        timestamp: new Date().toISOString()
      });
    }

    // Log additional context
    console.log("[ErrorBoundary] Current route:", window.location.pathname);
    console.log("[ErrorBoundary] Component tree context:", errorInfo.componentStack.split('\n'));
  }

  handleRetry = () => {
    // Clear the error state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    // Attempt to reload the current route
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message.includes('Failed to fetch dynamically imported module');
      
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {isChunkError ? "Erreur de chargement" : "Une erreur est survenue"}
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>
                {isChunkError 
                  ? "Le chargement de la page a échoué. Veuillez réessayer."
                  : this.state.error?.message || "Une erreur inattendue s'est produite."
                }
              </p>
              {this.state.error?.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">Détails techniques</summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-48 bg-gray-100 p-2 rounded">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </AlertDescription>
            <Button
              variant="outline"
              className="mt-4"
              onClick={this.handleRetry}
            >
              Réessayer
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
