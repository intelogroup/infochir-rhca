
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('PerformanceMetrics');

// Types for performance metrics
interface WebVitals {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint
  [key: string]: number | undefined; // Index signature for dynamic properties
}

interface ResourceMetrics {
  name: string;
  initiatorType: string;
  duration: number;
  transferSize?: number;
  decodedBodySize?: number;
  responseEnd?: number;
}

interface NavigationMetrics {
  type: string;
  redirectCount: number;
  activationStart?: number;
  loadEventEnd?: number;
  domComplete?: number;
  domContentLoadedEventEnd?: number;
  domContentLoadedEventStart?: number;
  domInteractive?: number;
  loadEventStart?: number;
  responseEnd?: number;
  responseStart?: number;
  requestStart?: number;
  connectEnd?: number;
  connectStart?: number;
  domainLookupEnd?: number;
  domainLookupStart?: number;
  fetchStart?: number;
  redirectEnd?: number;
  redirectStart?: number;
  secureConnectionStart?: number;
  serverTiming?: ReadonlyArray<PerformanceServerTiming>;
}

// Define a type that includes all the necessary fields for the database
interface PerformanceMetricsRecord {
  session_id: string;
  timestamp: string;
  page_url: string;
  user_agent: string;
  connection_type: string;
  screen_size: string;
  web_vitals: WebVitals;
  resource_metrics: ResourceMetrics[];
  navigation_metrics: NavigationMetrics;
  memory_heap_size: number;
  memory_heap_used: number;
}

// Queue to batch performance metrics
let metricsQueue: PerformanceMetricsRecord[] = [];
let queueTimeout: ReturnType<typeof setTimeout> | null = null;
const QUEUE_FLUSH_INTERVAL = 10000; // 10 seconds
const MAX_QUEUE_SIZE = 10;

/**
 * Create a unique session ID for tracking
 */
const getOrCreateSessionId = (): string => {
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
const getConnectionInfo = (): string => {
  const nav = navigator as any;
  if (!nav.connection) {
    return 'unknown';
  }
  
  return `${nav.connection.effectiveType || 'unknown'} (rtt: ${nav.connection.rtt || 'unknown'}, downlink: ${nav.connection.downlink || 'unknown'})`;
};

/**
 * Get memory usage if available
 */
const getMemoryInfo = (): { heapSize: number; heapUsed: number } => {
  const memory = (performance as any).memory;
  return {
    heapSize: memory ? memory.jsHeapSizeLimit : 0,
    heapUsed: memory ? memory.usedJSHeapSize : 0
  };
};

/**
 * Collect web vitals metrics
 */
const collectWebVitals = (): WebVitals => {
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
const collectResourceMetrics = (): ResourceMetrics[] => {
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
const collectNavigationMetrics = (): NavigationMetrics => {
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
      activationStart: nav.activationStart,
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

/**
 * Create a full performance metrics record
 */
const createPerformanceRecord = (route?: string): PerformanceMetricsRecord => {
  const memInfo = getMemoryInfo();
  
  return {
    session_id: getOrCreateSessionId(),
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    user_agent: navigator.userAgent,
    connection_type: getConnectionInfo(),
    screen_size: `${window.innerWidth}x${window.innerHeight}`,
    web_vitals: collectWebVitals(),
    resource_metrics: collectResourceMetrics(),
    navigation_metrics: collectNavigationMetrics(),
    memory_heap_size: memInfo.heapSize,
    memory_heap_used: memInfo.heapUsed
  };
};

/**
 * Flush the metrics queue to the database
 */
const flushMetricsQueue = async (): Promise<void> => {
  if (metricsQueue.length === 0) {
    return;
  }
  
  const queueToFlush = [...metricsQueue];
  metricsQueue = [];
  
  try {
    // Store metrics in local storage first as backup
    const storedMetrics = JSON.parse(sessionStorage.getItem('perf_metrics_queue') || '[]');
    sessionStorage.setItem('perf_metrics_queue', JSON.stringify([...storedMetrics, ...queueToFlush].slice(-50))); // Keep last 50
    
    // Insert metrics into database one by one to avoid type errors
    for (const record of queueToFlush) {
      const { error } = await supabase
        .from('performance_metrics')
        .insert({
          session_id: record.session_id,
          timestamp: record.timestamp,
          page_url: record.page_url,
          route: new URL(record.page_url).pathname,
          user_agent: record.user_agent,
          connection_type: record.connection_type,
          screen_size: record.screen_size,
          web_vitals: record.web_vitals,
          resource_metrics: record.resource_metrics,
          navigation_metrics: record.navigation_metrics,
          memory_heap_size: record.memory_heap_size,
          memory_heap_used: record.memory_heap_used
        });
      
      if (error) {
        logger.error(error, { context: 'flushMetricsQueue' });
      }
    }
    
    // Clear the successfully sent metrics from backup
    sessionStorage.removeItem('perf_metrics_queue');
    
  } catch (error) {
    logger.error(error, { context: 'flushMetricsQueue' });
  }
};

/**
 * Queue a metrics record for later sending
 */
const queueMetricsRecord = (record: PerformanceMetricsRecord): void => {
  metricsQueue.push(record);
  
  // Flush if queue is large enough
  if (metricsQueue.length >= MAX_QUEUE_SIZE) {
    flushMetricsQueue();
    return;
  }
  
  // Set up delayed flush if not already scheduled
  if (!queueTimeout) {
    queueTimeout = setTimeout(() => {
      flushMetricsQueue();
      queueTimeout = null;
    }, QUEUE_FLUSH_INTERVAL);
  }
};

/**
 * Initialize performance observers
 */
const setupPerformanceObservers = (): void => {
  try {
    // Resource timing observer
    if (window.PerformanceObserver) {
      // Resource timing
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        logger.debug(`Observed ${entries.length} resource entries`);
      });
      
      resourceObserver.observe({ type: 'resource', buffered: true });
      
      // Long tasks
      const longTaskObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          logger.debug(`Long task detected: ${entry.duration}ms`);
        });
      });
      
      longTaskObserver.observe({ type: 'longtask', buffered: true });
      
      // Layout shifts
      const layoutShiftObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          // Calculate CLS
          const cls = (entry as any).value;
          logger.debug(`Layout shift detected: ${cls}`);
        });
      });
      
      layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });
      
      // Largest contentful paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        logger.debug(`LCP: ${lastEntry.startTime}ms`);
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // First input delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          const eventEntry = entry as PerformanceEventTiming;
          if (eventEntry.processingStart && eventEntry.startTime) {
            const fid = eventEntry.processingStart - eventEntry.startTime;
            logger.debug(`FID: ${fid}ms`);
          }
        });
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
    }
    
  } catch (error) {
    logger.error(error, { context: 'setupPerformanceObservers' });
  }
};

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

/**
 * Initialize performance tracking
 */
export const initPerformanceTracking = (): () => void => {
  try {
    logger.log('Initializing performance tracking');
    
    // Set up observers
    setupPerformanceObservers();
    
    // Track initial page load
    trackPageView(window.location.pathname);
    
    // Set up flush on page unload
    const handleUnload = () => {
      flushMetricsQueue();
    };
    
    // Set up periodic metrics collection
    const periodicCollectionInterval = setInterval(() => {
      const metrics = createPerformanceRecord();
      queueMetricsRecord(metrics);
    }, 60000); // Every minute
    
    window.addEventListener('unload', handleUnload);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('unload', handleUnload);
      clearInterval(periodicCollectionInterval);
      if (queueTimeout) {
        clearTimeout(queueTimeout);
        queueTimeout = null;
      }
      flushMetricsQueue();
    };
    
  } catch (error) {
    logger.error(error, { context: 'initPerformanceTracking' });
    return () => {}; // Empty cleanup function
  }
};
