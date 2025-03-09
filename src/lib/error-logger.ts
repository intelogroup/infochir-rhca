
/**
 * Enhanced error logging utility
 */
export const logError = (
  error: unknown, 
  context: string, 
  metadata: Record<string, any> = {}
): void => {
  // Ensure we have a proper Error object
  const errorObj = error instanceof Error ? error : new Error(String(error || 'Unknown error'));
  
  // Make sure the error message is never empty
  if (!errorObj.message) {
    errorObj.message = `Error in ${context}`;
  }
  
  const timestamp = new Date().toISOString();
  
  // Construct error details
  const details = {
    message: errorObj.message,
    stack: errorObj.stack,
    name: errorObj.name,
    context,
    timestamp,
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    ...metadata
  };
  
  // Log to console
  console.error(`[${context}] Error:`, details);
  
  // In production, could send to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // For future implementation: send to error tracking service
    try {
      // Example implementation:
      // sendToErrorTrackingService(details);
      console.log('[ErrorTracking] Would send to error tracking service:', details);
    } catch (trackingError) {
      // Don't let tracking errors cause additional problems
      console.error('[ErrorTracking] Failed to track error:', trackingError);
    }
  }
};

/**
 * Captures and logs React errors with component information
 */
export const logReactError = (
  error: Error, 
  errorInfo: { componentStack: string }, 
  componentName: string
): void => {
  // Make sure the error message is never empty
  if (!error.message) {
    error.message = `Error in ${componentName}`;
  }
  
  // Check for router errors
  if (error.stack && (
    error.stack.includes('router.js') || 
    error.stack.includes('react-router') ||
    error.stack.includes('index.js:1374') ||
    error.stack.includes('assets/react-vendor')
  )) {
    error.name = 'NavigationError';
    if (!error.message || error.message === 'Unknown error') {
      error.message = 'Navigation error occurred';
    }
  }
  
  logError(error, `React Component: ${componentName}`, {
    componentStack: errorInfo.componentStack,
    componentName
  });
};

/**
 * Creates scoped logger for specific module/component
 */
export const createLogger = (moduleName: string) => {
  return {
    log: (message: string, ...args: any[]) => {
      console.log(`[${moduleName}] ${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      console.warn(`[${moduleName}] ${message}`, ...args);
    },
    error: (error: unknown, metadata: Record<string, any> = {}) => {
      logError(error, moduleName, metadata);
    },
    info: (message: string, ...args: any[]) => {
      console.info(`[${moduleName}] ${message}`, ...args);
    },
    debug: (message: string, ...args: any[]) => {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[${moduleName}] ${message}`, ...args);
      }
    }
  };
};

/**
 * Setup global error handlers for uncaught exceptions and unhandled rejections
 */
export const setupGlobalErrorHandlers = (): void => {
  if (typeof window === 'undefined') {
    return; // Only run in browser environment
  }

  const handleUnhandledError = (event: ErrorEvent) => {
    try {
      const error = event.error || new Error(event.message || 'Unknown error');
      console.error('[Global Error Handler] Uncaught error:', error);
      logError(error, 'window.onerror', { 
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      // Prevent default browser error handling
      event.preventDefault();
    } catch (handlerError) {
      console.error('[Error Handler] Failed to handle error:', handlerError);
    }
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    try {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason || 'Unknown promise rejection'));
      console.error('[Global Error Handler] Unhandled rejection:', error);
      logError(error, 'unhandledrejection');
      // Prevent default browser error handling
      event.preventDefault();
    } catch (handlerError) {
      console.error('[Error Handler] Failed to handle rejection:', handlerError);
    }
  };

  window.addEventListener('error', handleUnhandledError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  console.log('[Global Error Handler] Global error handlers installed');
};

// Export a convenience method for toast integration
export const showErrorToast = (error: unknown, context = 'Application'): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logError(error, context);
  
  // This implementation doesn't directly depend on a toast library
  // The consumer will need to implement the actual toast display
  console.log('[ErrorToast]', { message: errorMessage, context });
  
  // Dispatch a custom event that can be listened for by toast components
  try {
    const errorEvent = new CustomEvent('app:error', { 
      detail: { message: errorMessage, context } 
    });
    window.dispatchEvent(errorEvent);
  } catch (eventError) {
    console.error('[ErrorToast] Failed to dispatch error event:', eventError);
  }
};
