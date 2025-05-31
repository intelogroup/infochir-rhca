
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article, ArticleSource } from "@/components/index-medicus/types";
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useArticlesQuery');
const PAGE_SIZE = 10;

export const useArticlesQuery = (page = 0, source?: ArticleSource, categoryFilter?: string) => {
  return useQuery({
    queryKey: ["articles", page, source, categoryFilter],
    queryFn: async () => {
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      try {
        // Create initial query
        let query = supabase
          .from("articles")
          .select("*", { count: 'exact' })
          .order("publication_date", { ascending: false });
          
        // Add source filter if specified
        if (source) {
          query = query.eq("source", source);
        }

        // Add category filter if specified
        if (categoryFilter) {
          query = query.ilike("category", `%${categoryFilter}%`);
        }
          
        // Execute query with pagination
        const { data, error, count } = await query.range(start, end);

        if (error) {
          logger.error(error);
          toast.error("Erreur lors du chargement des articles");
          throw error;
        }

        if (!data || data.length === 0) {
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

        return { articles, totalPages };
      } catch (err) {
        logger.error(err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        
        // Don't show toast for aborted requests
        if (errorMessage !== 'AbortError: The operation was aborted' && 
            !errorMessage.includes('aborted')) {
          toast.error("Erreur lors du chargement des articles");
        }
        
        // Return empty state for network errors instead of failing completely
        if (errorMessage.includes('NetworkError') || errorMessage.includes('CORS') || 
            errorMessage.includes('AbortError')) {
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
