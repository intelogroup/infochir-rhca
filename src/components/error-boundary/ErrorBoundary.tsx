
import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { getLoadingDiagnostics } from "./utils/diagnostics";
import { getErrorMessage } from "./utils/errorMessages";
import { logReactError } from "@/lib/error-logger";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log(`[ErrorBoundary:${props.name || 'unnamed'}] Initializing`);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error("[ErrorBoundary] getDerivedStateFromError:", {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Handle context-specific errors
    if (error.message.includes('must be used within')) {
      console.error("[ErrorBoundary] Context provider missing:", error.message);
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const boundaryName = this.props.name || 'unnamed';
    
    // Use our enhanced error logger with proper typing
    // Ensuring the componentStack is always available
    logReactError(error, {
      componentStack: errorInfo.componentStack || 'No component stack available'
    }, boundaryName);

    // Add specific error handling for payment flows
    if (error.message.includes('Stripe') || error.message.includes('stripe.com')) {
      console.error("[ErrorBoundary] Payment error detected:", {
        message: error.message,
        network: {
          online: navigator.onLine,
          type: (navigator as any).connection?.type,
          effectiveType: (navigator as any).connection?.effectiveType
        }
      });
    }

    // Handle chunk loading errors
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      console.error("[ErrorBoundary] Chunk loading diagnostic:", getLoadingDiagnostics());
    }
    
    // Set error info in state
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    const { error } = this.state;
    if (!error) {
      window.location.reload();
      return;
    }

    const errorDetails = getErrorMessage(error);
    
    // Handle specific error recoveries
    if (error.message.includes('must be used within')) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    } else if (errorDetails.type === 'stripe_error') {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    } else {
      window.location.reload();
    }
  };

  renderErrorContent() {
    const { error } = this.state;
    if (!error) return null;

    const { title, message, details, type } = getErrorMessage(error);
    
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

          {error.stack && type === 'generic_error' && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm">Détails techniques</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-48 bg-gray-100 p-2 rounded">
                {error.stack}
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
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4">
          {this.renderErrorContent()}
        </div>
      );
    }

    return this.props.children;
  }
}
