
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/components/index-medicus/types";
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";
import { queryKeys } from "@/lib/react-query";
import { useComponentLifecycle } from "@/hooks/useComponentLifecycle";
import { useEffect, useRef } from "react";

const logger = createLogger('useArticlesQuery');
const PAGE_SIZE = 10;

export const useArticlesQuery = (page = 0) => {
  const { isMounted, createAbortController } = useComponentLifecycle();
  const controller = createAbortController();
  const timeoutRef = useRef<number | null>(null);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
  
  return useQuery({
    queryKey: queryKeys.articles.list(page),
    queryFn: async () => {
      logger.log('Starting articles fetch for page:', page);
      
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      logger.log('Executing Supabase query with range:', { start, end });

      try {
        // Create a timeout for the request
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set timeout to abort request after 8 seconds
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutRef.current = window.setTimeout(() => {
            if (isMounted()) {
              controller.abort('Request timeout');
              reject(new Error('Request timed out after 8 seconds'));
            }
          }, 8000);
        });
        
        // Create the query promise - we need to add a .then for proper typing
        const queryPromise = supabase
          .from("articles")
          .select("*", { count: 'exact' })
          .order("publication_date", { ascending: false })
          .range(start, end)
          .abortSignal(controller.signal)
          .then(response => response);  // This helps TypeScript understand it's a Promise
          
        // Race between the actual query and the timeout
        const response = await Promise.race([
          queryPromise,
          timeoutPromise
        ]);

        // Clear the timeout since the query completed
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        const { data, error, count } = response;

        logger.log('Supabase response:', { dataCount: data?.length, error, count });

        if (error) {
          logger.error("Supabase query error:", error);
          
          // Only show toast if component is still mounted
          if (isMounted()) {
            toast.error("Erreur lors du chargement des articles", {
              description: error.message
            });
          }
          throw error;
        }

        if (!data || data.length === 0) {
          logger.log('No data returned from query');
          return { articles: [], totalPages: 0 };
        }

        const articles: Article[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          abstract: item.abstract,
          date: item.publication_date,
          publicationDate: item.publication_date,
          source: item.source as Article['source'],
          category: item.category,
          authors: Array.isArray(item.authors) ? item.authors : [],
          tags: Array.isArray(item.tags) ? item.tags : [],
          imageUrl: item.image_url,
          views: item.views || 0,
          citations: item.citations || 0,
          pdfUrl: item.pdf_url,
          downloads: item.downloads || 0,
          institution: item.institution,
          status: (item.status === 'published' || item.status === 'pending' || item.status === 'draft') 
            ? item.status as 'published' | 'pending' | 'draft'
            : 'published',
          shares: item.shares || 0,
          volume: item.volume,
          issue: item.issue,
          pageNumber: item.page_number,
          specialty: item.specialty,
          articleType: item.source as Article['source']
        }));

        const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
        logger.log('Processed articles:', { count: articles.length, totalPages });

        return { articles, totalPages };
      } catch (err) {
        logger.error('Error fetching articles:', err);
        
        // Clear the timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        const errorMessage = err instanceof Error ? err.message : String(err);
        
        // Don't show toast for aborted requests or if component unmounted
        if (errorMessage !== 'AbortError: The operation was aborted' && 
            !errorMessage.includes('aborted') && 
            isMounted()) {
          toast.error("Erreur lors du chargement des articles", {
            description: errorMessage
          });
        }
        
        // Return empty state for network errors instead of failing completely
        if (errorMessage.includes('NetworkError') || errorMessage.includes('CORS') || 
            errorMessage.includes('AbortError')) {
          logger.warn('Returning empty state due to network/CORS error');
          return { articles: [], totalPages: 0 };
        }
        
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      // Only retry network/timeout errors, not data errors
      if (error instanceof Error && 
         (error.message.includes('network') || 
          error.message.includes('timeout') ||
          error.message.includes('CORS'))) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
