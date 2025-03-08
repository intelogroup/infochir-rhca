
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('PerformanceMetrics');

/**
 * Core Web Vitals metrics
 */
export interface WebVitals {
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  TTFB: number | null; // Time to First Byte
  INP: number | null; // Interaction to Next Paint
}

/**
 * Resource timing metrics
 */
export interface ResourceMetrics {
  name: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
  decodedBodySize: number;
}

/**
 * Navigation timing metrics
 */
export interface NavigationMetrics {
  type: string;
  pageLoadTime: number;
  dnsTime: number;
  tcpTime: number;
  ttfb: number;
  domInteractive: number;
  domComplete: number;
}

/**
 * Performance metrics record
 */
export interface PerformanceRecord {
  session_id: string;
  timestamp: string;
  page_url: string;
  user_agent: string;
  connection_type?: string;
  screen_size: string;
  webVitals: WebVitals;
  resourceMetrics?: ResourceMetrics[];
  navigationMetrics?: NavigationMetrics;
  jsHeapSize?: number;
  jsHeapUsed?: number;
}

/**
 * Collects Web Vitals metrics using Performance API
 */
const collectWebVitals = (): WebVitals => {
  const webVitals: WebVitals = {
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTFB: null,
    INP: null
  };

  try {
    // Get FCP (First Contentful Paint)
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      webVitals.FCP = Math.round(fcpEntry.startTime);
    }

    // Get TTFB (Time To First Byte)
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      webVitals.TTFB = Math.round(navEntry.responseStart);
    }

    // Using performance observer for LCP, CLS, and FID requires additional setup
    // which is handled by the setupPerformanceObservers function

    return webVitals;
  } catch (error) {
    logger.error(error, { context: 'collectWebVitals' });
    return webVitals;
  }
};

/**
 * Collects resource timing metrics
 */
const collectResourceMetrics = (limit = 10): ResourceMetrics[] => {
  try {
    return performance.getEntriesByType('resource')
      .filter(entry => {
        const url = entry.name;
        return url.includes('.js') || 
               url.includes('.css') || 
               url.includes('.jpg') || 
               url.includes('.png') || 
               url.includes('.svg');
      })
      .slice(0, limit)
      .map(entry => {
        const resource = entry as PerformanceResourceTiming;
        return {
          name: resource.name,
          initiatorType: resource.initiatorType,
          duration: Math.round(resource.duration),
          transferSize: resource.transferSize,
          decodedBodySize: resource.decodedBodySize
        };
      });
  } catch (error) {
    logger.error(error, { context: 'collectResourceMetrics' });
    return [];
  }
};

/**
 * Collects navigation timing metrics
 */
const collectNavigationMetrics = (): NavigationMetrics | null => {
  try {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!navEntry) return null;

    return {
      type: navEntry.type,
      pageLoadTime: Math.round(navEntry.loadEventEnd - navEntry.startTime),
      dnsTime: Math.round(navEntry.domainLookupEnd - navEntry.domainLookupStart),
      tcpTime: Math.round(navEntry.connectEnd - navEntry.connectStart),
      ttfb: Math.round(navEntry.responseStart - navEntry.requestStart),
      domInteractive: Math.round(navEntry.domInteractive - navEntry.startTime),
      domComplete: Math.round(navEntry.domComplete - navEntry.startTime)
    };
  } catch (error) {
    logger.error(error, { context: 'collectNavigationMetrics' });
    return null;
  }
};

/**
 * Gets memory usage metrics if available
 */
const getMemoryUsage = () => {
  try {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        jsHeapSize: memory.jsHeapSizeLimit,
        jsHeapUsed: memory.usedJSHeapSize
      };
    }
  } catch (error) {
    logger.error(error, { context: 'getMemoryUsage' });
  }
  return {
    jsHeapSize: undefined,
    jsHeapUsed: undefined
  };
};

/**
 * Setup performance observers for LCP, CLS and FID
 */
export const setupPerformanceObservers = (callback: (webVitals: Partial<WebVitals>) => void) => {
  try {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = Math.round(lastEntry.startTime);
      callback({ LCP: lcp });
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Only count layout shifts without recent user input
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      callback({ CLS: clsValue });
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-input') {
          const fid = Math.round((entry as PerformanceEventTiming).processingStart - entry.startTime);
          callback({ FID: fid });
          break;
        }
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Interaction to Next Paint (INP)
    const inpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      // Use the 75th percentile as the INP value
      const interactionTimes = entries.map(entry => {
        return (entry as any).duration;
      }).sort((a, b) => a - b);
      
      const idx = Math.floor(interactionTimes.length * 0.75);
      if (interactionTimes.length > 0 && idx < interactionTimes.length) {
        callback({ INP: Math.round(interactionTimes[idx]) });
      }
    });

    if (PerformanceObserver.supportedEntryTypes.includes('event')) {
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    }

    // Return disconnect function for cleanup
    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
      inpObserver.disconnect();
    };
  } catch (error) {
    logger.error(error, { context: 'setupPerformanceObservers' });
    return () => {}; // Return no-op function on error
  }
};

// Session ID for tracking metrics
let sessionId = '';

// Generate a unique session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Initialize session ID
export const initPerformanceTracking = () => {
  try {
    sessionId = localStorage.getItem('performance_session_id') || generateSessionId();
    localStorage.setItem('performance_session_id', sessionId);
    
    // Clear old performance entries
    performance.clearResourceTimings();
    
    // Setup observers to track metrics
    const webVitals: Partial<WebVitals> = {};
    
    // Setup performance observers
    const cleanup = setupPerformanceObservers((metrics) => {
      // Update web vitals with new metrics
      Object.assign(webVitals, metrics);
      
      // Store updated metrics if significant changes
      if (metrics.LCP || metrics.CLS || metrics.FID) {
        storePerformanceMetrics({ ...webVitals as WebVitals });
      }
    });
    
    // Return cleanup function
    return cleanup;
  } catch (error) {
    logger.error(error, { context: 'initPerformanceTracking' });
    return () => {}; // Return no-op function on error
  }
};

/**
 * Collects all performance metrics
 */
export const collectPerformanceMetrics = (): PerformanceRecord => {
  try {
    // Collect basic metrics
    const webVitals = collectWebVitals();
    const resourceMetrics = collectResourceMetrics(20); // Top 20 resources
    const navigationMetrics = collectNavigationMetrics();
    const memory = getMemoryUsage();
    
    // Get connection info if available
    const connection = (navigator as any).connection || {};
    
    return {
      session_id: sessionId || generateSessionId(),
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      connection_type: connection.effectiveType || undefined,
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
      webVitals,
      resourceMetrics,
      navigationMetrics: navigationMetrics || undefined,
      jsHeapSize: memory.jsHeapSize,
      jsHeapUsed: memory.jsHeapUsed
    };
  } catch (error) {
    logger.error(error, { context: 'collectPerformanceMetrics' });
    
    // Return minimal data on error
    return {
      session_id: sessionId || generateSessionId(),
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
      webVitals: {
        FCP: null,
        LCP: null,
        FID: null,
        CLS: null,
        TTFB: null,
        INP: null
      }
    };
  }
};

/**
 * Store performance metrics in Supabase
 */
export const storePerformanceMetrics = async (partialWebVitals?: Partial<WebVitals>) => {
  try {
    const performanceData = collectPerformanceMetrics();
    
    // Update web vitals with any provided values
    if (partialWebVitals) {
      performanceData.webVitals = {
        ...performanceData.webVitals,
        ...partialWebVitals
      };
    }
    
    logger.log('Storing performance metrics', performanceData);
    
    // Store in Supabase (table name assumed to be 'performance_metrics')
    const { error } = await supabase
      .from('performance_metrics')
      .insert([{
        session_id: performanceData.session_id,
        timestamp: performanceData.timestamp,
        page_url: performanceData.page_url,
        user_agent: performanceData.user_agent,
        connection_type: performanceData.connection_type,
        screen_size: performanceData.screen_size,
        web_vitals: performanceData.webVitals,
        resource_metrics: performanceData.resourceMetrics,
        navigation_metrics: performanceData.navigationMetrics,
        memory_heap_size: performanceData.jsHeapSize,
        memory_heap_used: performanceData.jsHeapUsed
      }]);
      
    if (error) {
      logger.error(error, { context: 'storePerformanceMetrics' });
      
      // Store metrics in sessionStorage as fallback
      const storedMetrics = JSON.parse(sessionStorage.getItem('performance_metrics') || '[]');
      storedMetrics.push(performanceData);
      sessionStorage.setItem('performance_metrics', JSON.stringify(storedMetrics.slice(-10))); // Keep last 10
    }
  } catch (error) {
    logger.error(error, { context: 'storePerformanceMetrics' });
  }
};

/**
 * Tracks a page view with performance metrics
 */
export const trackPageView = (route: string) => {
  try {
    // Allow metrics to be collected after page hydration
    setTimeout(() => {
      const metrics = collectPerformanceMetrics();
      
      // Add any additional page-specific information
      const pageViewData = {
        ...metrics,
        route,
        page_title: document.title,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      };
      
      logger.log('Page view tracked', { route, metrics: pageViewData });
      
      // Store the metrics
      storePerformanceMetrics();
    }, 2000); // Wait for 2 seconds to collect more accurate metrics
  } catch (error) {
    logger.error(error, { context: 'trackPageView' });
  }
};
