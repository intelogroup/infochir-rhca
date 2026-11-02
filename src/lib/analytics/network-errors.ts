/**
 * Bare network fetch failures, one per browser engine. These surface as
 * unhandled promise rejections with no usable app stack — most of them come
 * from Netlify's edge-injected RUM script failing to phone home on a flaky
 * connection, not from app code — so the error pipelines drop them instead
 * of counting them as application errors.
 */
export const NETWORK_FETCH_ERROR_MESSAGES: ReadonlySet<string> = new Set([
  "Failed to fetch", // Chrome / Edge
  "Load failed", // Safari
  "NetworkError when attempting to fetch resource.", // Firefox
]);

export const isNetworkFetchError = (message: string): boolean =>
  NETWORK_FETCH_ERROR_MESSAGES.has(message);
