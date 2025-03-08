
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtlasChapter } from "../types";
import { createLogger } from "@/lib/error-logger";
import { queryKeys } from "@/lib/react-query";
import { useComponentLifecycle } from "@/hooks/useComponentLifecycle";
import { useRef, useEffect, useCallback } from "react";
import { handleError } from "@/utils/errorHandling";

const logger = createLogger('useAtlasArticles');

export const useAtlasArticles = () => {
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
  
  // Create a memoized fetchArticles function
  const fetchArticles = useCallback(async () => {
    logger.log('Fetching Atlas chapters from articles table');
    
    try {
      // Create a timeout for the request
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a promise that will reject after timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef.current = window.setTimeout(() => {
          if (isMounted()) {
            controller.abort('Request timeout');
            reject(new Error('Request timed out after 8 seconds'));
          }
        }, 8000);
      });
      
      // Execute the Supabase query
      const queryPromise = supabase
        .from("articles") 
        .select("*")
        .eq('source', 'ADC')
        .order("publication_date", { ascending: false })
        .abortSignal(controller.signal);
      
      // Use Promise.race with proper typing to handle the timeout vs. query race
      let result;
      try {
        result = await Promise.race([
          queryPromise as Promise<any>,
          timeoutPromise
        ]);
      } catch (raceError) {
        throw raceError;
      }
      
      // Clear the timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Handle the response
      const { data, error } = result;
      
      if (error) {
        logger.error("Error fetching atlas chapters:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        logger.log('No ADC articles found in the articles table');
        return [];
      }

      logger.log(`Found ${data.length} ADC articles in the articles table`);

      const chapters: AtlasChapter[] = data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.abstract || undefined,
        abstract: item.abstract,
        content: item.abstract,
        lastUpdate: item.updated_at,
        publicationDate: item.publication_date,
        author: Array.isArray(item.authors) ? item.authors[0] : undefined,
        authors: Array.isArray(item.authors) ? item.authors : [],
        status: item.status === 'draft' ? 'coming' : 'available',
        coverImage: item.image_url,
        stats: {
          views: item.views || 0,
          shares: item.shares || 0,
          downloads: item.downloads || 0
        },
        tags: item.tags || [],
        volume: item.volume,
        specialty: item.specialty,
        category: item.category,
        source: "ADC",
        pdfUrl: item.pdf_url,
        imageUrls: item.article_files || [],
        institution: item.institution,
        userId: item.user_id
      })) || [];

      return chapters;
    } catch (error) {
      // Clear the timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Log the error with more details
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Error fetching atlas chapters: ${errorMessage}`, error);
      
      // For CORS errors or network failures, we return an empty array instead of throwing
      if (errorMessage.includes('NetworkError') || errorMessage.includes('CORS') || 
          errorMessage.includes('AbortError')) {
        logger.warn('Returning empty array due to network/CORS error');
        return [];
      }
      
      throw error;
    }
  }, [controller, isMounted]);
  
  return useQuery({
    queryKey: queryKeys.atlasChapters,
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};
