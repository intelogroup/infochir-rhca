
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
  errorInfo: React.ErrorInfo, 
  componentName: string
): void => {
  console.error(`[React Component: ${componentName}] Error:`, error.message);
};

/**
 * Creates scoped logger for specific module/component
 */
export const createLogger = (moduleName: string) => {
  return {
    log: (message: string, ...args: any[]) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[${moduleName}] ${message}`, ...(args || []));
      }
    },
    warn: (message: string, ...args: any[]) => {
      console.warn(`[${moduleName}] ${message}`, ...(args || []));
    },
    error: (error: unknown, metadata?: any) => {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      console.error(`[${moduleName}] Error:`, errorObj.message, metadata || '');
    },
    info: (message: string, ...args: any[]) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[${moduleName}] ${message}`, ...(args || []));
      }
    },
    debug: (message: string, ...args: any[]) => {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[${moduleName}] ${message}`, ...(args || []));
      }
    }
  };
};
