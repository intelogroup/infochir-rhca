
import { Json } from "@/integrations/supabase/types";

// Types for performance metrics
export interface WebVitals {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint
  [key: string]: number | undefined; // Index signature for dynamic properties
}

export interface ResourceMetrics {
  name: string;
  initiatorType: string;
  duration: number;
  transferSize?: number;
  decodedBodySize?: number;
  responseEnd?: number;
}

export interface NavigationMetrics {
  type: string;
  redirectCount: number;
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
export interface PerformanceMetricsRecord {
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
