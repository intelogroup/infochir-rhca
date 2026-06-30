import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from './session';

const reported = new Set<string>();

const send = async (metric: Metric) => {
  // Sample once per session per metric name to keep insert volume tiny
  if (reported.has(metric.name)) return;
  reported.add(metric.name);

  try {
    await supabase.from('performance_metrics').insert({
      session_id: getSessionId(),
      page_url: window.location.href.slice(0, 2000),
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      user_agent: navigator.userAgent.slice(0, 500),
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
      navigation_type: metric.navigationType,
    });
  } catch {
    // Swallow — observability must never break the app
  }
};

export const initWebVitals = () => {
  // Skip in dev unless explicitly enabled
  if (!import.meta.env.PROD && import.meta.env.VITE_DEBUG_ANALYTICS !== 'true') {
    return;
  }
  try {
    onCLS(send);
    onINP(send);
    onLCP(send);
    onFCP(send);
    onTTFB(send);
  } catch {
    // ignore
  }
};
