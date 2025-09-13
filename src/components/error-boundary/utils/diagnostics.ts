
/**
 * Enhanced diagnostics utility for error boundary
 */
export const getLoadingDiagnostics = (): string => {
  const diagnostics = {
    navigatorOnline: typeof navigator !== 'undefined' ? navigator.onLine : 'unknown',
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'unknown',
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    timestamp: new Date().toISOString(),
    performanceTiming: typeof performance !== 'undefined' ? {
      pageLoad: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 'unavailable',
      domReady: performance.timing ? performance.timing.domComplete - performance.timing.domLoading : 'unavailable'
    } : 'unknown'
  };

  return JSON.stringify(diagnostics, null, 2);
};

/**
 * Check if we're in a development or debug environment
 */
export const isDebugMode = (): boolean => {
  return import.meta.env.DEV || 
         import.meta.env.MODE === 'development' || 
         import.meta.env.VITE_DEBUG === 'true' ||
         import.meta.env.VITE_APP_PREVIEW === 'true';
};
