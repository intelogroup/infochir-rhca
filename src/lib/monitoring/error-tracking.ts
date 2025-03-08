import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import React from 'react';

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

// Error queue for batching
let errorQueue: ErrorRecord[] = [];
let queueTimeout: ReturnType<typeof setTimeout> | null = null;
const QUEUE_FLUSH_INTERVAL = 5000; // 5 seconds
const MAX_QUEUE_SIZE = 5;

/**
 * Flush the error queue to Supabase
 */
const flushErrorQueue = async (): Promise<void> => {
  if (errorQueue.length === 0) {
    return;
  }
  
  const queueToFlush = [...errorQueue];
  errorQueue = [];
  
  try {
    // Store in sessionStorage as backup
    const storedErrors = JSON.parse(sessionStorage.getItem('error_events') || '[]');
    sessionStorage.setItem('error_events', JSON.stringify([...storedErrors, ...queueToFlush].slice(-20))); // Keep last 20
    
    // Store in Supabase
    const { error: supabaseError } = await supabase
      .from('error_events')
      .insert(queueToFlush.map(record => ({
        session_id: record.session_id,
        timestamp: record.timestamp,
        error_type: record.error_type,
        message: record.message,
        stack: record.stack,
        component: record.component,
        url: record.url,
        route: record.route,
        user_agent: record.user_agent,
        metadata: record.metadata
      })));
      
    if (supabaseError) {
      logger.error(supabaseError, { 
        context: 'flushErrorQueue'
      });
    } else {
      // Clear the successfully sent errors from backup
      sessionStorage.removeItem('error_events');
    }
  } catch (error) {
    logger.error(error, { context: 'flushErrorQueue' });
  }
};

/**
 * Get or create a session ID for tracking
 */
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('error_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('error_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Queue an error for later sending
 */
const queueError = (record: ErrorRecord): void => {
  errorQueue.push(record);
  
  // Flush if queue is large enough
  if (errorQueue.length >= MAX_QUEUE_SIZE) {
    flushErrorQueue();
    return;
  }
  
  // Set up delayed flush if not already scheduled
  if (!queueTimeout) {
    queueTimeout = setTimeout(() => {
      flushErrorQueue();
      queueTimeout = null;
    }, QUEUE_FLUSH_INTERVAL);
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
    const sessionId = getOrCreateSessionId();
    
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
    
    // Queue error for batch sending
    queueError(errorRecord);
    
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
    if (event.error && (event.error as any)._suppressReactErrorLogging) {
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
