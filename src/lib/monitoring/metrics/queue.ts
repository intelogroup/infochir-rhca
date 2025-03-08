
import { PerformanceMetricsRecord } from './types';
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('MetricsQueue');

// Queue to batch performance metrics
let metricsQueue: PerformanceMetricsRecord[] = [];
let queueTimeout: ReturnType<typeof setTimeout> | null = null;
const QUEUE_FLUSH_INTERVAL = 10000; // 10 seconds
const MAX_QUEUE_SIZE = 10;

/**
 * Flush the metrics queue to the database
 */
export const flushMetricsQueue = async (): Promise<void> => {
  if (metricsQueue.length === 0) {
    return;
  }
  
  const queueToFlush = [...metricsQueue];
  metricsQueue = [];
  
  try {
    // Store metrics in local storage first as backup
    try {
      const storedMetrics = JSON.parse(sessionStorage.getItem('perf_metrics_queue') || '[]');
      sessionStorage.setItem('perf_metrics_queue', JSON.stringify([...storedMetrics, ...queueToFlush].slice(-50))); // Keep last 50
    } catch (storageError) {
      logger.warn('Failed to store metrics in sessionStorage', { error: storageError });
    }
    
    // Insert metrics into database one by one to avoid type errors
    for (const record of queueToFlush) {
      try {
        const { error } = await supabase
          .from('performance_metrics')
          .insert({
            created_at: new Date().toISOString(), // Use created_at instead of timestamp
            page_url: record.page_url,
            route: new URL(record.page_url).pathname,
            user_agent: record.user_agent,
            connection_type: record.connection_type,
            screen_size: record.screen_size,
            web_vitals: record.web_vitals,
            resource_metrics: record.resource_metrics,
            navigation_metrics: record.navigation_metrics,
            memory_heap_size: record.memory_heap_size,
            memory_heap_used: record.memory_heap_used,
            session_id: record.session_id
          });
        
        if (error) {
          logger.error(error, { context: 'flushMetricsQueue' });
        }
      } catch (insertError) {
        logger.error('Error inserting metric record', { 
          error: insertError,
          record: {
            url: record.page_url,
            timestamp: record.timestamp
          }
        });
      }
    }
    
    // Clear the successfully sent metrics from backup
    try {
      sessionStorage.removeItem('perf_metrics_queue');
    } catch (clearError) {
      logger.warn('Failed to clear metrics from sessionStorage', { error: clearError });
    }
    
  } catch (error) {
    logger.error(error, { context: 'flushMetricsQueue' });
  }
};

/**
 * Queue a metrics record for later sending
 */
export const queueMetricsRecord = (record: PerformanceMetricsRecord): void => {
  try {
    metricsQueue.push(record);
    
    // Flush if queue is large enough
    if (metricsQueue.length >= MAX_QUEUE_SIZE) {
      flushMetricsQueue().catch(error => {
        logger.error('Error flushing metrics queue', { error });
      });
      return;
    }
    
    // Set up delayed flush if not already scheduled
    if (!queueTimeout) {
      queueTimeout = setTimeout(() => {
        flushMetricsQueue().catch(error => {
          logger.error('Error in scheduled flush of metrics queue', { error });
        });
        queueTimeout = null;
      }, QUEUE_FLUSH_INTERVAL);
    }
  } catch (error) {
    logger.error('Error queueing metrics record', { error });
  }
};

// Utility function to flush queue on demand (e.g., when page unloads)
export const forceFlushQueue = (): void => {
  try {
    if (queueTimeout) {
      clearTimeout(queueTimeout);
      queueTimeout = null;
    }
    
    // Use void to indicate we're deliberately ignoring the promise
    void flushMetricsQueue();
  } catch (error) {
    logger.error('Error in force flush of metrics queue', { error });
  }
};
