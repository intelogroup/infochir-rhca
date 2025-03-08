
// This file re-exports the metrics API from the new modular structure
// for backward compatibility
export {
  trackPerformanceEvent,
  trackPageView,
  initPerformanceTracking
} from './metrics';
