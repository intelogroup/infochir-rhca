import React, { useState, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { createLogger } from "@/lib/error-logger";
import { GenericErrorBoundary } from "./GenericErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  name: string; // Specific name of the component for better error tracking
  fallbackRender?: (props: { error: Error; reset: () => void }) => React.ReactNode;
  onReset?: () => void; // Optional callback when reset button is clicked
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /**
   * If true, errors only show minimally with a retry button (good for cards in lists)
   */
  minimal?: boolean;
  /**
   * If true, skeleton UI will be shown when retrying
   */
  showLoadingOnRetry?: boolean;
  /**
   * Number of consecutive errors before component is considered "permanently failed"
   */
  maxErrorCount?: number;
  /**
   * Class name for the error container
   */
  className?: string;
}

const logger = createLogger('ComponentErrorBoundary');

/**
 * Default fallback UI for component-level errors
 */
const DefaultFallbackUI = ({ 
  error, 
  reset, 
  name, 
  minimal = false,
  errorCount = 1,
  maxErrorCount = 3,
  isRetrying = false
}: { 
  error: Error; 
  reset: () => void; 
  name: string;
  minimal?: boolean;
  errorCount?: number;
  maxErrorCount?: number;
  isRetrying?: boolean;
}) => {
  const permanentlyFailed = errorCount >= maxErrorCount;
  
  // For minimal rendering (e.g. in lists)
  if (minimal) {
    return (
      <div className="p-3 bg-red-50 rounded-md text-sm text-red-800 space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Le chargement a échoué</span>
        </div>
        {!permanentlyFailed && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={reset}
            disabled={isRetrying}
            className="w-full"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              "Réessayer"
            )}
          </Button>
        )}
      </div>
    );
  }
  
  // Standard error display
  return (
    <Alert variant="destructive" className="my-2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur dans {name}</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{error.message}</p>
        {!permanentlyFailed ? (
          <Button 
            variant="outline" 
            onClick={reset}
            disabled={isRetrying}
            size="sm"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              "Réessayer"
            )}
          </Button>
        ) : (
          <p className="text-sm text-red-700">
            Le composant a échoué après plusieurs tentatives.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
};

/**
 * Enhanced error boundary specifically for component-level error handling
 * with support for retry counts, loading states, and minimal rendering
 */
export const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({
  children,
  name,
  fallbackRender,
  onReset,
  onError,
  minimal = false,
  showLoadingOnRetry = true,
  maxErrorCount = 3,
  className
}) => {
  const [errorCount, setErrorCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    return () => {
      // Reset state on unmount to avoid memory leaks
      setErrorCount(0);
      setIsRetrying(false);
    };
  }, []);

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Increment error count
    setErrorCount(prev => prev + 1);
    
    // Log the error with component information
    logger.error(`Error in ${name} component:`, {
      error,
      componentStack: errorInfo.componentStack,
      count: errorCount + 1,
      maxErrorCount
    });
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  const handleReset = () => {
    if (errorCount >= maxErrorCount) {
      logger.warn(`Component ${name} has exceeded max error count (${maxErrorCount})`);
      return;
    }

    setIsRetrying(true);
    
    // Use a small timeout to allow loading state to render
    setTimeout(() => {
      if (onReset) {
        onReset();
      }
      setIsRetrying(false);
    }, 500);
  };

  return (
    <GenericErrorBoundary
      errorContext={name}
      onError={handleError}
      fallbackRenderer={({ error, resetErrorBoundary }) => {
        // If a custom fallback renderer is provided, use it
        if (fallbackRender) {
          return fallbackRender({ 
            error, 
            reset: () => {
              handleReset();
              resetErrorBoundary();
            }
          });
        }

        // If we're retrying and should show loading state
        if (isRetrying && showLoadingOnRetry) {
          return minimal ? (
            <div className="animate-pulse">
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          ) : (
            <div className="p-4 animate-pulse space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          );
        }

        // Otherwise show the default fallback UI
        return (
          <div className={className}>
            <DefaultFallbackUI
              error={error}
              reset={() => {
                handleReset();
                resetErrorBoundary();
              }}
              name={name}
              minimal={minimal}
              errorCount={errorCount}
              maxErrorCount={maxErrorCount}
              isRetrying={isRetrying}
            />
          </div>
        );
      }}
    >
      {children}
    </GenericErrorBoundary>
  );
};
