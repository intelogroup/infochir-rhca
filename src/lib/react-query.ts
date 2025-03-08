
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache freshness
      gcTime: 10 * 60 * 1000, // Keep unused cache data for 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Only retry network errors, not data errors
        if (error instanceof Error && 
            (error.message.includes('network') || 
             error.message.includes('timeout') ||
             error.message.includes('fetch'))) {
          return failureCount < 3;
        }
        return false;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      networkMode: 'offlineFirst'
    },
  },
});

// Data prefetching utility
export const prefetchQueries = async () => {
  // Prefetch common data used across the app
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['home-stats'],
      queryFn: async () => {
        const { data: articles } = await supabase
          .from('articles')
          .select('id, views, citations')
          .limit(100);
        
        const { data: members } = await supabase
          .from('members')
          .select('id')
          .limit(100);
        
        return { articles, members };
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    }),
    
    // Prefetch latest articles for the carousel
    queryClient.prefetchQuery({
      queryKey: ['carousel-highlights'],
      queryFn: async () => {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .in('source', ['IGM', 'RHCA', 'ADC'])
          .order('publication_date', { ascending: false })
          .limit(6);
        
        return data || [];
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  ]);
};
