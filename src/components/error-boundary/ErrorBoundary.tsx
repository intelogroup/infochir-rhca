
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
    // Ensure error has a message
    if (!error.message) {
      error.message = 'Unknown error';
    }
    
    console.error("[ErrorBoundary] getDerivedStateFromError:", {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Handle context-specific errors
    if (error.message && error.message.includes('must be used within')) {
      console.error("[ErrorBoundary] Context provider missing:", error.message);
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const boundaryName = this.props.name || 'unnamed';
    
    // Ensure the error has a message
    if (!error.message) {
      error.message = `Error in ${boundaryName}`;
    }
    
    // Ensure componentStack is always available
    const safeErrorInfo = {
      componentStack: errorInfo.componentStack || 'No component stack available'
    };
    
    // Use our enhanced error logger
    logReactError(error, safeErrorInfo, boundaryName);

    // Add specific error handling for downloads
    if (error.message.includes('download') || error.message.includes('fetch')) {
      console.error("[ErrorBoundary] Download error detected:", {
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
    
    // Handle common React Router errors
    if (error.stack && (
      error.stack.includes('router.js') || 
      error.stack.includes('react-router') ||
      error.stack.includes('index.js:1374')
    )) {
      console.error("[ErrorBoundary] React Router error detected:", {
        message: error.message || "Router error",
        path: window.location.pathname,
        search: window.location.search
      });
    }
    
    // Set error info in state
    this.setState({ errorInfo: safeErrorInfo });
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
    } else if (error.message.includes('download') || error.message.includes('fetch')) {
      // For download errors, just reset the component state
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    } else if (errorDetails.type === 'download_error') {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    } else if (error.stack && (
      error.stack.includes('router.js') || 
      error.stack.includes('react-router')
    )) {
      // For router errors, try navigating to home
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  };

  renderErrorContent() {
    const { error } = this.state;
    if (!error) return null;

    // Ensure we have an error message
    const safeError = {
      ...error,
      message: error.message || "An unknown error occurred"
    };

    const { title, message, details, type } = getErrorMessage(safeError);
    
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
