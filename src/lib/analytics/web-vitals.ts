import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from './session';

const collected: Record<string, { value: number; rating: string }> = {};
let flushTimer: number | null = null;
let flushed = false;

const flush = async () => {
  if (flushed) return;
  flushed = true;
  try {
    await supabase.from('performance_metrics').insert({
      session_id: getSessionId(),
      page_url: window.location.href.slice(0, 2000),
      route: window.location.pathname.slice(0, 500),
      user_agent: navigator.userAgent.slice(0, 500),
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
      web_vitals: collected,
    });
  } catch {
    // Swallow — never break the app
  }
};

const record = (metric: Metric) => {
  collected[metric.name] = { value: metric.value, rating: metric.rating };
  if (flushTimer) window.clearTimeout(flushTimer);
  // Debounce: flush 5s after the last metric arrives
  flushTimer = window.setTimeout(() => void flush(), 5000);
};

export const initWebVitals = () => {
  if (!import.meta.env.PROD && import.meta.env.VITE_DEBUG_ANALYTICS !== 'true') {
    return;
  }
  try {
    onCLS(record);
    onINP(record);
    onLCP(record);
    onFCP(record);
    onTTFB(record);

    // Final flush on page hide
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') void flush();
    });
  } catch {
    // ignore
  }
};
