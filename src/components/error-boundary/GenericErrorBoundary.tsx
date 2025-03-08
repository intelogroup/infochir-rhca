
import { Component, ErrorInfo, ReactNode, isValidElement, cloneElement } from "react";
import { FallbackUI } from "./FallbackUI";
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";
import { handleBoundaryError } from "@/lib/monitoring/error-tracking";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRenderer?: (props: { error: Error; resetErrorBoundary: () => void }) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
  errorContext?: string;
  showHome?: boolean;
  /**
   * If true, toast error messages will be shown when errors occur
   */
  showErrorToasts?: boolean;
  /**
   * Maximum number of reset attempts before giving up
   */
  maxResets?: number;
  /**
   * If true, will render children even if there's an error (for non-critical components)
   */
  renderChildrenOnError?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  resetCount: number;
  lastReset: number | null;
}

const logger = createLogger('GenericErrorBoundary');

export class GenericErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    resetCount: 0,
    lastReset: null
  };

  // Time window for consecutive resets in milliseconds
  resetTimeWindow = 60000; // 1 minute

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('[GenericErrorBoundary] Error caught:', error);
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Mark React errors to prevent duplicate reporting
    (error as any)._suppressReactErrorLogging = true;
    
    // Log the error with context
    logger.error(`Error caught in ${this.props.errorContext || 'unknown'}:`, {
      error,
      componentStack: errorInfo.componentStack,
      resetCount: this.state.resetCount
    });
    
    // Show error toast if enabled
    if (this.props.showErrorToasts) {
      const title = this.props.errorContext 
        ? `Erreur dans ${this.props.errorContext}`
        : `Une erreur est survenue`;
        
      toast.error(title, {
        description: error.message.length > 100 
          ? error.message.substring(0, 100) + '...' 
          : error.message,
        duration: 5000,
      });
    }
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Use error tracking
    handleBoundaryError(error, errorInfo, this.props.errorContext || 'unknown');
  }

  resetErrorBoundary = () => {
    const now = Date.now();
    const { lastReset, resetCount } = this.state;
    const { maxResets = 3 } = this.props;
    
    // Check if we're within the reset time window
    const isWithinTimeWindow = lastReset && (now - lastReset < this.resetTimeWindow);
    
    // Calculate new reset count
    const newResetCount = isWithinTimeWindow ? resetCount + 1 : 1;
    
    // Check if we've exceeded max resets
    if (newResetCount > maxResets) {
      logger.warn(`Error boundary reset limit reached (${maxResets} resets in ${this.resetTimeWindow / 1000}s)`);
      
      // Show toast to inform user
      toast.error("Trop d'erreurs consécutives", {
        description: "Veuillez réessayer plus tard ou contacter le support si le problème persiste.",
        duration: 10000,
      });
      
      // Don't reset, just update the count
      this.setState({ resetCount: newResetCount });
      return;
    }
    
    // Update state and reset the error boundary
    this.setState({
      hasError: false,
      error: null,
      resetCount: newResetCount,
      lastReset: now
    });
    
    // Call the onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error, resetCount } = this.state;
    const { 
      children, 
      fallback, 
      fallbackRenderer, 
      errorContext,
      showHome,
      renderChildrenOnError,
      maxResets = 3
    } = this.props;

    // If there's no error, render children normally
    if (!hasError || !error) {
      return children;
    }

    // Exceeded max resets but requested to render children anyway
    if (resetCount > maxResets && renderChildrenOnError) {
      logger.warn(`Rendering children despite error after ${resetCount} resets`);
      return children;
    }

    // If a custom fallback renderer is provided, use it
    if (fallbackRenderer) {
      return fallbackRenderer({ 
        error, 
        resetErrorBoundary: this.resetErrorBoundary 
      });
    }
    
    // If a fallback element is provided, use it
    if (fallback) {
      // If fallback is a React element, clone it to pass the error and reset function
      if (isValidElement(fallback)) {
        return cloneElement(fallback as React.ReactElement, {
          error,
          resetErrorBoundary: this.resetErrorBoundary
        });
      }
      return fallback;
    }
    
    // Default fallback UI
    return (
      <FallbackUI
        error={error}
        resetErrorBoundary={this.resetErrorBoundary}
        errorContext={errorContext}
        showHome={showHome}
      />
    );
  }
}
