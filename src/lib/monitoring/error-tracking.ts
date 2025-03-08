
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('ErrorTracking');

/**
 * Error record structure for storing in Supabase
 */
export interface ErrorRecord {
  session_id: string;
  timestamp: string;
  error_type: string;
  message: string;
  stack?: string;
  component?: string;
  url: string;
  route: string;
  user_agent: string;
  metadata?: Record<string, any>;
}

/**
 * Normalized error information with additional context
 */
export interface NormalizedError {
  type: string;
  message: string;
  stack?: string;
  component?: string;
  metadata?: Record<string, any>;
}

/**
 * Normalize different error types into a consistent format
 */
export const normalizeError = (error: unknown, component?: string, metadata?: Record<string, any>): NormalizedError => {
  try {
    // Handle Error objects
    if (error instanceof Error) {
      return {
        type: error.name || 'Error',
        message: error.message,
        stack: error.stack,
        component,
        metadata
      };
    }
    
    // Handle string errors
    if (typeof error === 'string') {
      return {
        type: 'StringError',
        message: error,
        component,
        metadata
      };
    }
    
    // Handle object errors
    if (error && typeof error === 'object') {
      const objError = error as Record<string, any>;
      return {
        type: objError.name || 'ObjectError',
        message: objError.message || JSON.stringify(objError),
        stack: objError.stack,
        component,
        metadata: {
          ...metadata,
          originalError: objError
        }
      };
    }
    
    // Default case
    return {
      type: 'UnknownError',
      message: String(error),
      component,
      metadata: {
        ...metadata,
        originalValue: error
      }
    };
  } catch (normalizeError) {
    // Last resort error handling
    return {
      type: 'ErrorNormalizationFailed',
      message: 'Failed to normalize error',
      metadata: {
        normalizeError: String(normalizeError)
      }
    };
  }
};

/**
 * Track an error in Supabase
 */
export const trackError = async (
  error: unknown, 
  component?: string, 
  metadata?: Record<string, any>
) => {
  try {
    // Get session ID from localStorage or generate one
    const sessionId = localStorage.getItem('error_session_id') || 
                      Math.random().toString(36).substring(2, 15);
    
    // Store session ID for future errors
    if (!localStorage.getItem('error_session_id')) {
      localStorage.setItem('error_session_id', sessionId);
    }
    
    // Normalize the error
    const normalizedError = normalizeError(error, component, metadata);
    
    // Create error record
    const errorRecord: ErrorRecord = {
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      error_type: normalizedError.type,
      message: normalizedError.message,
      stack: normalizedError.stack,
      component: normalizedError.component,
      url: window.location.href,
      route: window.location.pathname,
      user_agent: navigator.userAgent,
      metadata: {
        ...normalizedError.metadata,
        window_size: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer,
        platform: navigator.platform,
        online: navigator.onLine
      }
    };
    
    logger.log('Tracking error', errorRecord);
    
    // Store in Supabase
    const { error: supabaseError } = await supabase
      .from('error_events')
      .insert([{
        session_id: errorRecord.session_id,
        timestamp: errorRecord.timestamp,
        error_type: errorRecord.error_type,
        message: errorRecord.message,
        stack: errorRecord.stack,
        component: errorRecord.component,
        url: errorRecord.url,
        route: errorRecord.route,
        user_agent: errorRecord.user_agent,
        metadata: errorRecord.metadata
      }]);
      
    if (supabaseError) {
      logger.error(supabaseError, { 
        context: 'trackError',
        errorRecord 
      });
      
      // Store in sessionStorage as fallback
      const storedErrors = JSON.parse(sessionStorage.getItem('error_events') || '[]');
      storedErrors.push(errorRecord);
      sessionStorage.setItem('error_events', JSON.stringify(storedErrors.slice(-20))); // Keep last 20
    }
    
    return errorRecord;
  } catch (trackingError) {
    // Log fallback for when tracking itself fails
    console.error('[ErrorTracking] Failed to track error:', trackingError);
    console.error('Original error:', error);
    return null;
  }
};

/**
 * Enhanced error handler for React error boundaries
 */
export const handleBoundaryError = (
  error: Error, 
  errorInfo: React.ErrorInfo, 
  boundaryName: string
) => {
  // Log to console immediately
  console.error(`[${boundaryName}] React component error:`, error);
  
  // Track in our monitoring system
  trackError(error, boundaryName, {
    componentStack: errorInfo.componentStack,
    errorInfo: errorInfo,
    boundary: boundaryName,
    reactVersion: React.version
  });
  
  // Return formatted error for display
  return {
    message: error.message,
    component: boundaryName,
    componentStack: errorInfo.componentStack
  };
};

/**
 * Setup global error handlers
 */
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackError(event.reason, 'UnhandledPromiseRejection', {
      promiseEvent: {
        type: event.type,
        timeStamp: event.timeStamp,
      }
    });
  });
  
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    // Avoid duplicate reports for errors already caught by React
    if (event.error && event.error._suppressReactErrorLogging) {
      return;
    }
    
    trackError(event.error || event.message, 'UncaughtError', {
      errorEvent: {
        type: event.type,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timeStamp: event.timeStamp
      }
    });
  });
  
  logger.log('Global error handlers set up');
};

/**
 * Create context information for an error
 */
export const getErrorContext = () => {
  return {
    url: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    browserInfo: {
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      online: navigator.onLine,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt,
      } : undefined
    },
    screenInfo: {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio,
      orientation: screen.orientation ? screen.orientation.type : undefined
    },
    timestamp: new Date().toISOString(),
    memory: (performance as any).memory ? {
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize
    } : undefined
  };
};
