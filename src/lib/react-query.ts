
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Create a centralized query cache key factory to maintain consistency
export const queryKeys = {
  articles: {
    all: ['articles'] as const,
    list: (page: number) => [...queryKeys.articles.all, 'list', page] as const,
    detail: (id: string) => [...queryKeys.articles.all, 'detail', id] as const,
  },
  homeStats: ['home-stats'] as const,
  carouselHighlights: ['carousel-highlights'] as const,
  members: ['members'] as const,
  igmIssues: ['igm-issues'] as const,
  atlasChapters: ['atlas-chapters'] as const,
  rhcaArticles: ['rhca-articles'] as const
};

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

// Data prefetching utility with improved consistency through queryKeys
export const prefetchQueries = async () => {
  // Prefetch common data used across the app
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.homeStats,
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
      queryKey: queryKeys.carouselHighlights,
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

// Function to extract the most critical data from an article
// This allows individual queries to use consistent projections
export const extractArticleData = (article) => ({
  id: article.id,
  title: article.title,
  abstract: article.abstract,
  publicationDate: article.publication_date,
  authors: Array.isArray(article.authors) ? article.authors : [],
  source: article.source,
  category: article.category,
  tags: Array.isArray(article.tags) ? article.tags : [],
  imageUrl: article.image_url,
  pdfUrl: article.pdf_url
});

// Invalidate specific queries when data changes
export const invalidateArticles = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
};

// Queue prefetching for related entities when navigating to detail pages
export const prefetchRelatedQueries = (articleId: string) => {
  // We batch prefetch operations to avoid redundant requests
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.articles.detail(articleId),
      queryFn: async () => {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .single();
        return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  ]);
};
