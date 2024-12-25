import { Component } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "@/types";

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by boundary:", error);
    console.error("Error info:", errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  getUserFriendlyMessage(error: Error | null): string {
    if (!error) return "Une erreur inattendue est survenue.";

    if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
      return "Problème de connexion internet. Veuillez vérifier votre connexion et réessayer.";
    }

    if (error.message.includes("timeout") || error.message.includes("expiré")) {
      return "La requête a pris trop de temps. Veuillez réessayer.";
    }

    if (error.message.includes("401") || error.message.includes("unauthorized")) {
      return "Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vous connecter.";
    }

    if (error.message.includes("404") || error.message.includes("not found")) {
      return "La ressource demandée n'a pas été trouvée.";
    }

    return error.message || "Une erreur inattendue est survenue. Veuillez réessayer.";
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="mb-2">Une erreur est survenue</AlertTitle>
            <AlertDescription className="space-y-4">
              <p className="text-sm">
                {this.getUserFriendlyMessage(this.state.error)}
              </p>
              <Button 
                onClick={this.handleRetry}
                variant="outline"
                className="mt-4"
              >
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}