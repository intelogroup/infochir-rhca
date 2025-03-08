
import { Component, ErrorInfo, ReactNode } from "react";
import { FallbackUI } from "./FallbackUI";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRenderer?: (props: { error: Error; resetErrorBoundary: () => void }) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  errorContext?: string;
  showHome?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GenericErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    console.error(`[ErrorBoundary:${this.props.errorContext || 'app'}]`, error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, fallbackRenderer, errorContext, showHome } = this.props;

    if (hasError && error) {
      if (fallbackRenderer) {
        return fallbackRenderer({ error, resetErrorBoundary: this.resetErrorBoundary });
      }
      
      if (fallback) {
        return fallback;
      }
      
      return (
        <FallbackUI
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
          errorContext={errorContext}
          showHome={showHome}
        />
      );
    }

    return children;
  }
}
