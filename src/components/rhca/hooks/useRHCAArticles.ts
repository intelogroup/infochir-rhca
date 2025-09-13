
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, getStorageUrl } from '@/integrations/supabase/client';
import type { RhcaArticle } from '../types';
import { mapDatabaseArticleToArticle } from '@/components/index-medicus/types';
import { toast } from 'sonner';

// Check if we're in development or debugging mode
const isDebugMode = import.meta.env.DEV || 
                   import.meta.env.VITE_APP_PREVIEW === 'true' || 
                   import.meta.env.VITE_DEBUG === 'true';

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

// Log only in debug mode
const debugLog = (message: string, ...args: any[]) => {
  if (isDebugMode) {
    console.log(`[RHCA:INFO] ${message}`, ...args);
  }
};

// Better error logging
const errorLog = (message: string, error: unknown) => {
  if (isDebugMode) {
    console.error(`[RHCA:ERROR] ${message}`, error);
  }
};

export const useRHCAArticles = () => {
  const [error, setError] = useState<Error | null>(null);

  // Process articles from database response
  const processArticles = useCallback((data: any[]): RhcaArticle[] => {
    if (!data || data.length === 0) return [];
    
    debugLog(`Processing ${data.length} articles`);
    
    return data.map((article: any) => {
      // Generate cover image filename if needed
      let coverImageFilename = article.cover_image_filename;
      
      if (!coverImageFilename && article.volume && article.issue) {
        const paddedVolume = String(article.volume).padStart(2, '0');
        const issueDate = new Date(article.publication_date);
        
        if (isNaN(issueDate.getTime())) {
          coverImageFilename = `RHCA_vol_${paddedVolume}_no_${article.issue}.png`;
        } else {
          const day = String(issueDate.getDate()).padStart(2, '0');
          const month = String(issueDate.getMonth() + 1).padStart(2, '0');
          const year = issueDate.getFullYear();
          coverImageFilename = `RHCA_vol_${paddedVolume}_no_${article.issue}_${day}_${month}_${year}.png`;
        }
      }
      
      // Ensure required fields have default values
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
      
      // Map the article with base properties
      const mappedArticle = mapDatabaseArticleToArticle(articleWithDefaults);
      
      // Add RHCA-specific properties
      return {
        ...mappedArticle,
        pdfFileName: article.pdf_filename || undefined,
        coverImageFileName: coverImageFilename || undefined,
        image_url: article.image_url || undefined
      } as RhcaArticle;
    });
  }, []);

  // Use React Query to handle data fetching and caching
  const { data: articles = [], isLoading, refetch } = useQuery({
    queryKey: ['rhca-articles'],
    queryFn: async () => {
      debugLog(`Fetching RHCA articles from database`);
      
      try {
        // Create a timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('source', 'RHCA')
          .order('publication_date', { ascending: false })
          .abortSignal(controller.signal);

        // Clear the timeout
        clearTimeout(timeoutId);

        if (error) {
          errorLog('Error fetching RHCA articles:', error);
          setError(new Error(error.message));
          throw error;
        }

        if (!data || data.length === 0) {
          debugLog('No RHCA articles found');
          return [];
        }

        debugLog(`Retrieved ${data.length} RHCA articles`);
        
        // Sample the first article for debugging
        if (isDebugMode && data.length > 0) {
          console.log('[RHCA:DEBUG] Sample article data:', data[0]);
          console.log('[RHCA:DEBUG] Available columns:', Object.keys(data[0]));
        }
        
        const processedArticles = processArticles(data);
        debugLog(`Processed ${processedArticles.length} articles`);
        setError(null);
        return processedArticles;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        errorLog(`Error in fetchRHCAArticles: ${errorMessage}`, err);
        
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Don't show toast for aborted requests (they're intentional)
        if (errorMessage !== 'AbortError: The operation was aborted' && 
            !errorMessage.includes('aborted')) {
          toast.error("Erreur lors du chargement des articles RHCA", {
            description: errorMessage
          });
        }
        
        // Return empty state for network errors instead of throwing completely
        if (errorMessage.includes('NetworkError') || errorMessage.includes('CORS') || 
            errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
          return [];
        }
        
        throw err;
      } finally {
        debugLog('Finished loading RHCA articles');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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

  return { articles, loading: isLoading, error, refetch };
};
