import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from './session';

const MAX_ERRORS_PER_SESSION = 10;
let reported = 0;
const seen = new Set<string>();

export const reportError = async (params: {
  errorType: string;
  message: string;
  stack?: string;
  componentStack?: string;
  url?: string;
}) => {
  if (reported >= MAX_ERRORS_PER_SESSION) return;

  // Dedupe identical errors within a session
  const fingerprint = `${params.errorType}:${params.message}`.slice(0, 200);
  if (seen.has(fingerprint)) return;
  seen.add(fingerprint);
  reported += 1;

  try {
    await supabase.from('error_events').insert({
      session_id: getSessionId(),
      error_type: params.errorType.slice(0, 100),
      message: params.message.slice(0, 5000),
      stack: params.stack?.slice(0, 10000) ?? null,
      component_stack: params.componentStack?.slice(0, 5000) ?? null,
      url: (params.url ?? window.location.href).slice(0, 2000),
      user_agent: navigator.userAgent.slice(0, 500),
    });
  } catch {
    // Swallow — never let observability break the app
  }
};

export const initErrorReporting = () => {
  if (!import.meta.env.PROD && import.meta.env.VITE_DEBUG_ANALYTICS !== 'true') {
    return;
  }

  window.addEventListener('error', (event) => {
    void reportError({
      errorType: 'window.error',
      message: event.message || 'Unknown error',
      stack: event.error?.stack,
      url: event.filename || window.location.href,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message =
      typeof reason === 'string'
        ? reason
        : reason?.message ?? JSON.stringify(reason)?.slice(0, 500) ?? 'Unhandled rejection';
    void reportError({
      errorType: 'unhandledrejection',
      message,
      stack: reason?.stack,
    });
  });
};
