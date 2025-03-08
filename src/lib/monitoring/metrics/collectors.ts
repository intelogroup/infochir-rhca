
import { WebVitals, ResourceMetrics, NavigationMetrics } from './types';
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('MetricsCollectors');

/**
 * Collect web vitals metrics
 */
export const collectWebVitals = (): WebVitals => {
  const webVitals: WebVitals = {};
  
  try {
    // Get First Contentful Paint (FCP) if available
    const fcpEntries = performance.getEntriesByName('first-contentful-paint', 'paint');
    if (fcpEntries.length > 0) {
      webVitals.fcp = fcpEntries[0].startTime;
    }
    
    // Largest Contentful Paint
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries && lcpEntries.length > 0) {
      webVitals.lcp = lcpEntries[lcpEntries.length - 1].startTime;
    }
    
    // First Input Delay
    const fidEntries = performance.getEntriesByType('first-input');
    if (fidEntries && fidEntries.length > 0) {
      const firstInput = fidEntries[0] as PerformanceEventTiming;
      webVitals.fid = firstInput.processingStart 
        ? firstInput.processingStart - firstInput.startTime 
        : undefined;
    }
    
    // Time to First Byte
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      const nav = navEntries[0] as PerformanceNavigationTiming;
      webVitals.ttfb = nav.responseStart - nav.requestStart;
    }
    
  } catch (error) {
    logger.error(error, { context: 'collectWebVitals' });
  }
  
  return webVitals;
};

/**
 * Collect resource timing information
 */
export const collectResourceMetrics = (): ResourceMetrics[] => {
  try {
    // Get all resource timing entries
    const resourceEntries = performance.getEntriesByType('resource');
    
    // Map to simplified metrics
    return resourceEntries.map(entry => {
      const resource = entry as PerformanceResourceTiming;
      return {
        name: resource.name,
        initiatorType: resource.initiatorType,
        duration: resource.duration,
        transferSize: resource.transferSize,
        decodedBodySize: resource.decodedBodySize,
        responseEnd: resource.responseEnd
      };
    }).slice(-10); // Only take the last 10 resources to avoid sending too much data
    
  } catch (error) {
    logger.error(error, { context: 'collectResourceMetrics' });
    return [];
  }
};

/**
 * Collect navigation timing metrics
 */
export const collectNavigationMetrics = (): NavigationMetrics => {
  const defaultNav: NavigationMetrics = {
    type: 'unknown',
    redirectCount: 0
  };
  
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (!navEntries || navEntries.length === 0) {
      return defaultNav;
    }
    
    const nav = navEntries[0] as PerformanceNavigationTiming;
    
    return {
      type: nav.type,
      redirectCount: nav.redirectCount,
      loadEventEnd: nav.loadEventEnd,
      domComplete: nav.domComplete,
      domContentLoadedEventEnd: nav.domContentLoadedEventEnd,
      domContentLoadedEventStart: nav.domContentLoadedEventStart,
      domInteractive: nav.domInteractive,
      loadEventStart: nav.loadEventStart,
      responseEnd: nav.responseEnd,
      responseStart: nav.responseStart,
      requestStart: nav.requestStart,
      connectEnd: nav.connectEnd,
      connectStart: nav.connectStart,
      domainLookupEnd: nav.domainLookupEnd,
      domainLookupStart: nav.domainLookupStart,
      fetchStart: nav.fetchStart,
      redirectEnd: nav.redirectEnd,
      redirectStart: nav.redirectStart,
      secureConnectionStart: nav.secureConnectionStart,
      serverTiming: nav.serverTiming
    };
    
  } catch (error) {
    logger.error(error, { context: 'collectNavigationMetrics' });
    return defaultNav;
  }
};
