/**
 * Environment utility functions for safe environment detection
 * Compatible with Vite's import.meta.env
 */

/**
 * Check if we're in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};

/**
 * Check if we're in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD || import.meta.env.MODE === 'production';
};

/**
 * Check if we're in debug/preview mode
 */
export const isDebugMode = (): boolean => {
  return isDevelopment() || 
         import.meta.env.VITE_APP_PREVIEW === 'true' ||
         import.meta.env.VITE_DEBUG === 'true';
};

/**
 * Check if analytics debugging is enabled
 */
export const isAnalyticsDebugEnabled = (): boolean => {
  return import.meta.env.VITE_DEBUG_ANALYTICS === 'true' || isDevelopment();
};

/**
 * Get the current environment mode
 */
export const getEnvironmentMode = (): string => {
  return import.meta.env.MODE || 'development';
};