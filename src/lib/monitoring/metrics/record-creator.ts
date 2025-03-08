
import { PerformanceMetricsRecord } from './types';
import { collectWebVitals, collectNavigationMetrics, collectResourceMetrics } from './collectors';
import { getOrCreateSessionId, getConnectionInfo, getMemoryInfo } from './session';

/**
 * Create a full performance metrics record
 */
export const createPerformanceRecord = (route?: string): PerformanceMetricsRecord => {
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
