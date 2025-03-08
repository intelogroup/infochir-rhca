import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createLogger } from '@/lib/error-logger';

interface ErrorContextType {
  errors: AppError[];
  addError: (error: AppError) => void;
  clearError: (id: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

export interface AppError {
  id: string;
  message: string;
  timestamp: Date;
  context?: string;
  componentStack?: string;
  code?: string;
  handled?: boolean;
  details?: Record<string, unknown>;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);
const logger = createLogger('ErrorContext');

interface ErrorProviderProps {
  children: ReactNode;
  maxErrors?: number;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ 
  children, 
  maxErrors = 10 
}) => {
  const [errors, setErrors] = useState<AppError[]>([]);
  
  const addError = (error: AppError) => {
    logger.log('Adding error to context:', {
      message: error.message,
      context: error.context
    });
    
    setErrors(prev => {
      // Generate a unique ID if not provided
      const errorWithId = {
        ...error,
        id: error.id || `error-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      };
      
      // Keep only the latest errors up to maxErrors
      const updatedErrors = [errorWithId, ...prev].slice(0, maxErrors);
      return updatedErrors;
    });
  };
  
  const clearError = (id: string) => {
    logger.log('Clearing error:', id);
    setErrors(prev => prev.filter(error => error.id !== id));
  };
  
  const clearAllErrors = () => {
    logger.log('Clearing all errors');
    setErrors([]);
  };
  
  // Report errors to analytics/monitoring in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // This could be replaced with actual error reporting service
      errors.forEach(error => {
        if (!error.handled) {
          console.error('[ErrorReporting]', error);
          // Mark as handled
          setErrors(prev => 
            prev.map(e => 
              e.id === error.id ? { ...e, handled: true } : e
            )
          );
        }
      });
    }
  }, [errors]);
  
  return (
    <ErrorContext.Provider 
      value={{ 
        errors, 
        addError, 
        clearError, 
        clearAllErrors, 
        hasErrors: errors.length > 0 
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
};

// Utility hook to report errors
export const useErrorReporting = (componentName: string) => {
  const { addError } = useErrorContext();
  
  const reportError = (error: Error, details?: Record<string, unknown>) => {
    logger.error(`Error in ${componentName}:`, error);
    
    addError({
      id: `${componentName}-${Date.now()}`,
      message: error.message,
      timestamp: new Date(),
      context: componentName,
      componentStack: error.stack,
      details
    });
  };
  
  return { reportError };
};
