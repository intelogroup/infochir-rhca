
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('MetricsSession');

/**
 * Create a unique session ID for tracking
 */
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('perf_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('perf_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Get information about the current network connection
 */
export const getConnectionInfo = (): string => {
  const nav = navigator as any;
  if (!nav.connection) {
    return 'unknown';
  }
  
  return `${nav.connection.effectiveType || 'unknown'} (rtt: ${nav.connection.rtt || 'unknown'}, downlink: ${nav.connection.downlink || 'unknown'})`;
};

/**
 * Get memory usage if available
 */
export const getMemoryInfo = (): { heapSize: number; heapUsed: number } => {
  const memory = (performance as any).memory;
  return {
    heapSize: memory ? memory.jsHeapSizeLimit : 0,
    heapUsed: memory ? memory.usedJSHeapSize : 0
  };
};
