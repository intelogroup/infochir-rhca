
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
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const boundaryName = this.props.name || 'unnamed';
    logReactError(error, errorInfo, boundaryName);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    window.location.reload();
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
