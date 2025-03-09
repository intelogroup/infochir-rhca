
import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { getLoadingDiagnostics, isDebugMode } from "./utils/diagnostics";
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
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const boundaryName = this.props.name || 'unnamed';
    logReactError(error, errorInfo, boundaryName);
    this.setState({ errorInfo });
    
    // Log extra diagnostics in debug mode
    if (isDebugMode()) {
      console.error(`Error caught in boundary '${boundaryName}':`, error);
      console.error('React component stack:', errorInfo.componentStack);
      console.error('System diagnostics:', getLoadingDiagnostics());
    }
  }

  handleRetry = () => {
    window.location.reload();
  };

  handleBackToHome = () => {
    window.location.href = '/';
  };

  renderErrorContent() {
    const { error } = this.state;
    if (!error) return null;

    const { title, message } = getErrorMessage(error);
    
    return (
      <Alert variant="destructive" className="p-6">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold mb-2">{title}</AlertTitle>
        <AlertDescription className="space-y-4">
          <p className="text-base">{message}</p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={this.handleRetry}
            >
              Réessayer
            </Button>
            <Button
              variant="default"
              onClick={this.handleBackToHome}
            >
              Retour à l'accueil
            </Button>
          </div>
          {isDebugMode() && error.stack && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono overflow-auto">
              <pre>{error.stack}</pre>
            </div>
          )}
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
