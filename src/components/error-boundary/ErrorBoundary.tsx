
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

    // Log additional context
    console.log("[ErrorBoundary] Current route:", window.location.pathname);
    console.log("[ErrorBoundary] Component tree context:", errorInfo.componentStack.split('\n'));
  }

  render() {
    if (this.state.hasError) {
      console.log("[ErrorBoundary] Rendering error UI with error:", this.state.error);
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Une erreur est survenue</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>{this.state.error?.message || "Une erreur inattendue s'est produite."}</p>
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
              onClick={() => window.location.reload()}
            >
              Recharger la page
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
