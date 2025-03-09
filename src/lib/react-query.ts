
import { QueryClient } from "@tanstack/react-query";

// Check if we're in development, preview or debugging mode
const isDebugMode = process.env.NODE_ENV === 'development' || 
                   process.env.VITE_APP_PREVIEW === 'true' || 
                   process.env.DEBUG === 'true';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: !isDebugMode, // Only refetch on window focus in production
      retry: isDebugMode ? 1 : 2, // More retries in production
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      networkMode: 'always',
    },
    mutations: {
      retry: isDebugMode ? 0 : 1,
      networkMode: 'always',
    }
  }
});

// Prefetch options for common queries
export const COMMON_PREFETCH_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
};

// Global error handler for queries
export const handleQueryError = (error: unknown): void => {
  if (isDebugMode) {
    console.error('Query error:', error);
  }
  // In production, we'll just let the error boundaries handle it
};
