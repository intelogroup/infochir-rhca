
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('MetricsObservers');

/**
 * Initialize performance observers
 */
export const setupPerformanceObservers = (): void => {
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
