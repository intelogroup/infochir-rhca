
/**
 * Enhanced error logging utility
 */
export const logError = (
  error: unknown, 
  context: string, 
  metadata: Record<string, any> = {}
): void => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const timestamp = new Date().toISOString();
  
  // Construct error details
  const details = {
    message: errorObj.message,
    stack: errorObj.stack,
    name: errorObj.name,
    context,
    timestamp,
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...metadata
  };
  
  // Log to console
  console.error(`[${context}] Error:`, details);
  
  // In production, could send to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Send to your error tracking service here
    // Example: sendToErrorTrackingService(details);
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
