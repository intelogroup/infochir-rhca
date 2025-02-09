
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { getLoadingDiagnostics } from "./utils/diagnostics";
import { getErrorMessage } from "./utils/errorMessages";
import { toast } from "sonner";

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
    // Log detailed error information
    console.error("[ErrorBoundary] Error caught:", {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name,
      componentStack: errorInfo.componentStack,
      errorInfo
    });

    // Additional diagnostics for specific error types
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      console.error("[ErrorBoundary] Network error detected:", {
        message: error.message,
        online: navigator.onLine,
        connection: {
          type: (navigator as any).connection?.type,
          effectiveType: (navigator as any).connection?.effectiveType,
          downlink: (navigator as any).connection?.downlink
        }
      });
    }

    if (error.message.includes('timeout') || error.name === 'TimeoutError') {
      console.error("[ErrorBoundary] Timeout error detected:", {
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }

    if (error.message.includes('Stripe') || error.message.includes('stripe.com')) {
      console.error("[ErrorBoundary] Stripe error detected:", {
        message: error.message,
        network: {
          online: navigator.onLine,
          type: (navigator as any).connection?.type,
          effectiveType: (navigator as any).connection?.effectiveType
        }
      });
    }

    if (error.message.includes('Failed to fetch dynamically imported module')) {
      console.error("[ErrorBoundary] Chunk loading diagnostic:", getLoadingDiagnostics());
    }
  }

  handleRetry = () => {
    const { error } = this.state;
    if (!error) {
      window.location.reload();
      return;
    }

    const errorDetails = getErrorMessage(error);
    
    switch (errorDetails.type) {
      case 'network_error':
        // For network errors, check connection first
        if (navigator.onLine) {
          this.setState({ hasError: false, error: undefined });
          toast.success("Tentative de reconnexion...");
        } else {
          toast.error("Pas de connexion internet");
        }
        break;
        
      case 'timeout_error':
        // For timeout errors, retry with toast notification
        this.setState({ hasError: false, error: undefined });
        toast.info("Nouvelle tentative...");
        break;
        
      case 'stripe_error':
        // For Stripe errors, clear state and reinitialize
        this.setState({ hasError: false, error: undefined });
        toast.info("Réinitialisation du système de paiement...");
        break;
        
      default:
        // For other errors, do a full page reload
        window.location.reload();
    }
  };

  renderErrorContent() {
    if (!this.state.error) return null;

    const { title, message, details, type } = getErrorMessage(this.state.error);
    
    return (
      <Alert variant="destructive" className="p-6">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold mb-2">{title}</AlertTitle>
        <AlertDescription className="space-y-4">
          <p className="text-base">{message}</p>
          
          {details && (
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}

          {this.state.error.stack && type === 'generic_error' && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm">Détails techniques</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-48 bg-gray-100 p-2 rounded">
                {this.state.error.stack}
              </pre>
            </details>
          )}

          <Button
            variant="outline"
            className="mt-4"
            onClick={this.handleRetry}
          >
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          {this.renderErrorContent()}
        </div>
      );
    }

    return this.props.children;
  }
}

