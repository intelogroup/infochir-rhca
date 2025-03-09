
/**
 * Simplified error logging utility
 */
export const logError = (
  error: unknown
): void => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  console.error(`Error:`, errorObj.message);
};

/**
 * Captures and logs React errors with component information
 */
export const logReactError = (
  error: Error, 
  errorInfo: { componentStack: string }, 
  componentName: string
): void => {
  console.error(`[React Component: ${componentName}] Error:`, error.message);
};

/**
 * Creates scoped logger for specific module/component
 */
export const createLogger = (moduleName: string) => {
  return {
    log: (message: string) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[${moduleName}] ${message}`);
      }
    },
    warn: (message: string) => {
      console.warn(`[${moduleName}] ${message}`);
    },
    error: (error: unknown) => {
      logError(error);
    },
    info: (message: string) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[${moduleName}] ${message}`);
      }
    },
    debug: (message: string) => {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[${moduleName}] ${message}`);
      }
    }
  };
};
