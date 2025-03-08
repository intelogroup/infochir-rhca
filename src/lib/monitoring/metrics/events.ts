
import { queueMetricsRecord } from './queue';
import { createPerformanceRecord } from './record-creator';
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('MetricsEvents');

/**
 * Track a specific performance event
 */
export const trackPerformanceEvent = (
  eventName: string, 
  duration: number,
  metadata: Record<string, any> = {}
): void => {
  try {
    // Create a custom performance mark
    performance.mark(`${eventName}-end`);
    
    // Log the event
    logger.debug(`Performance event: ${eventName}`, { duration, ...metadata });
    
    // Queue for sending
    const record = createPerformanceRecord();
    record.web_vitals = { ...record.web_vitals, [eventName]: duration };
    queueMetricsRecord(record);
    
  } catch (error) {
    logger.error(error, { context: 'trackPerformanceEvent' });
  }
};

/**
 * Track page view with performance metrics
 */
export const trackPageView = (route: string): void => {
  try {
    // Mark the navigation
    performance.mark(`page-view-${route}`);
    
    // Collect and queue metrics
    const metrics = createPerformanceRecord(route);
    queueMetricsRecord(metrics);
    
    // Log a debug message
    logger.debug(`Page view tracked: ${route}`, {
      fcp: metrics.web_vitals.fcp,
      lcp: metrics.web_vitals.lcp,
      ttfb: metrics.web_vitals.ttfb
    });
    
  } catch (error) {
    logger.error(error, { context: 'trackPageView' });
  }
};
