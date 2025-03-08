
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RhcaArticle } from '../types';
import { mapDatabaseArticleToArticle } from '@/components/index-medicus/types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { createLogger } from '@/lib/error-logger';
import { useComponentLifecycle } from '@/hooks/useComponentLifecycle';
import { useRef, useEffect } from 'react';

// Define a more specific type for the database article that includes cover_image_filename
interface RhcaDatabaseArticle {
  id: string;
  title: string;
  abstract: string;
  publication_date: string;
  authors: string[];
  source: string;
  category: string;
  tags: string[];
  pdf_url: string;
  image_url: string;
  cover_image: string;
  views: number;
  downloads: number;
  shares: number;
  citations: number;
  volume?: string;
  issue?: string;
  specialty?: string;
  pdf_filename?: string;
  cover_image_filename?: string;
  [key: string]: any;
}

const logger = createLogger('useRHCAArticles');

export const useRHCAArticles = () => {
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
  
  const fetchRHCAArticles = useCallback(async () => {
    logger.log('[RHCA:INFO] Fetching RHCA articles from database');
    
    // Create a timeout for the request
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a promise that will reject after timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutRef.current = window.setTimeout(() => {
        if (isMounted()) {
          controller.abort('Request timeout');
          reject(new Error('Request timed out after 10 seconds'));
        }
      }, 10000);
    });
    
    try {
      // Use the articles table directly instead of the view to ensure we get all fields
      const queryPromise = supabase
        .from('articles')
        .select('*')
        .eq('source', 'RHCA')
        .order('publication_date', { ascending: false })
        .abortSignal(controller.signal);
      
      // Race between the actual query and the timeout
      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as Awaited<ReturnType<typeof queryPromise>>;

      // Clear the timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (error) {
        logger.error('[RHCA:ERROR] Error fetching RHCA articles:', error);
        throw error;
      }

      if (!data || !data.length) {
        logger.warn('[RHCA:WARN] No data returned from articles table');
        return [];
      }

      logger.log(`[RHCA:INFO] Retrieved ${data.length} RHCA articles`);
      
      const mappedArticles = data.map((article: any) => {
        // Get cover image filename from database or generate one if not present
        let coverImageFilename = article.cover_image_filename;
        
        if (!coverImageFilename && article.volume && article.issue) {
          // Try to build a cover image filename based on the format RHCA_vol_XX_no_XX_DD_MM_YYYY.png
          const paddedVolume = String(article.volume).padStart(2, '0');
          const issueDate = new Date(article.publication_date);
          
          // Use formatted date if available, otherwise use simplified format
          if (isNaN(issueDate.getTime())) {
            coverImageFilename = `RHCA_vol_${paddedVolume}_no_${article.issue}.png`;
          } else {
            const day = String(issueDate.getDate()).padStart(2, '0');
            const month = String(issueDate.getMonth() + 1).padStart(2, '0');
            const year = issueDate.getFullYear();
            coverImageFilename = `RHCA_vol_${paddedVolume}_no_${article.issue}_${day}_${month}_${year}.png`;
          }
        }
        
        // Ensure required fields have default values to match DatabaseArticle type
        const articleWithDefaults: RhcaDatabaseArticle = {
          ...article,
          pdf_url: article.pdf_url || '',
          image_url: article.image_url || '',
          cover_image: article.cover_image || article.image_url || '',
          views: article.views || 0,
          downloads: article.downloads || 0,
          shares: article.shares || 0,
          citations: article.citations || 0,
          cover_image_filename: coverImageFilename
        };
        
        // First map the base article properties
        const mappedArticle = mapDatabaseArticleToArticle(articleWithDefaults);
        
        // Then add RHCA-specific properties
        return {
          ...mappedArticle,
          pdfFileName: article.pdf_filename || undefined,
          coverImageFileName: coverImageFilename || undefined,
          image_url: article.image_url || undefined
        } as RhcaArticle;
      });
      
      logger.log(`[RHCA:INFO] Processed ${mappedArticles.length} articles`);
      return mappedArticles;
    } catch (err) {
      // Clear the timeout if there's an error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error(`[RHCA:ERROR] Error in fetchRHCAArticles: ${errorMessage}`, err);
      
      // Don't show toast for aborted requests or if component unmounted
      if (errorMessage !== 'AbortError: The operation was aborted' && 
          !errorMessage.includes('aborted') && 
          isMounted()) {
        toast.error("Erreur lors du chargement des articles RHCA", {
          description: errorMessage
        });
      }
      
      throw err;
    }
  }, [controller, isMounted]);

  const { 
    data: articles = [], 
    isLoading: loading, 
    error,
    refetch 
  } = useQuery({
    queryKey: queryKeys.rhcaArticles,
    queryFn: fetchRHCAArticles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Only retry network errors
      if ((errorMessage.includes('NetworkError') || 
           errorMessage.includes('CORS') || 
           errorMessage.includes('timeout')) && 
          failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff with 10s max
  });

  return { articles, loading, error, refetch };
};
