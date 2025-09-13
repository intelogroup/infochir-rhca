
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Check if we're in development, preview or debugging mode
const isDebugMode = import.meta.env.DEV || 
                   import.meta.env.VITE_APP_PREVIEW === 'true' || 
                   import.meta.env.VITE_DEBUG === 'true';

// Create a more resilient query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: !isDebugMode, // Only refetch on window focus in production
      retry: isDebugMode ? 1 : 3, // More retries in production
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      networkMode: 'always',
      meta: {
        errorHandler: (error: unknown) => {
          console.error('Query error:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          // Only show toast for non-canceled requests
          if (!errorMessage.includes('canceled') && !errorMessage.includes('aborted')) {
            toast.error("Erreur de chargement des données. Veuillez réessayer.");
          }
        }
      }
    },
    mutations: {
      retry: isDebugMode ? 0 : 2,
      networkMode: 'always',
      meta: {
        errorHandler: (error: unknown) => {
          console.error('Mutation error:', error);
          toast.error("Erreur lors de la mise à jour des données. Veuillez réessayer.");
        }
      }
    }
  }
});

// Add offline support
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    queryClient.invalidateQueries();
    toast.success("La connexion a été rétablie.");
  });
  
  window.addEventListener('offline', () => {
    toast.error("Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.");
  });
}

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

// Add helper to prefetch critical resources
export const prefetchCriticalResources = async () => {
  // Could prefetch important queries here
  // For example: queryClient.prefetchQuery(['articles'], fetchArticles)
};

// Initialize prefetch on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      prefetchCriticalResources().catch(console.error);
    }, 1000);
  });
}
