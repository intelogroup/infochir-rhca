
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RhcaArticle } from '../types';
import { mapDatabaseArticleToArticle } from '@/components/index-medicus/types';

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
  pdf_url?: string;
  image_url?: string;
  views?: number;
  downloads?: number;
  shares?: number;
  citations?: number;
  volume?: string;
  issue?: string;
  specialty?: string;
  pdf_filename?: string;
  cover_image_filename?: string;
  // Add any other fields that might be in the database
  [key: string]: any;
}

export const useRHCAArticles = () => {
  const [articles, setArticles] = useState<RhcaArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRHCAArticles = async () => {
      try {
        setLoading(true);
        console.log('[RHCA:INFO] Fetching RHCA articles from database');
        
        // Use the view we created to get articles with cover_image_filename
        const { data, error } = await supabase
          .from('rhca_articles_view')
          .select('*')
          .order('publication_date', { ascending: false });

        if (error) {
          console.error('[RHCA:ERROR] Error fetching from rhca_articles_view:', error);
          throw error;
        }

        if (data) {
          console.log(`[RHCA:INFO] Retrieved ${data.length} articles from rhca_articles_view`);
          
          // Log first article for debugging column names
          if (data.length > 0) {
            console.log('[RHCA:DEBUG] Sample article data:', data[0]);
            console.log('[RHCA:DEBUG] Available columns:', Object.keys(data[0]));
          }
          
          const mappedArticles = data.map((article: RhcaDatabaseArticle) => {
            console.log(`[RHCA:DEBUG] Processing article: ${article.id}, title: ${article.title}`);
            
            // Check if cover_image_filename exists
            if ('cover_image_filename' in article) {
              console.log(`[RHCA:DEBUG] Article has cover_image_filename: ${article.cover_image_filename}`);
            } else {
              console.warn(`[RHCA:WARN] Article ${article.id} missing cover_image_filename`);
            }
            
            // Check if pdf_filename exists
            if ('pdf_filename' in article) {
              console.log(`[RHCA:DEBUG] Article has pdf_filename: ${article.pdf_filename}`);
            } else {
              console.warn(`[RHCA:WARN] Article ${article.id} missing pdf_filename`);
            }
            
            // First map the base article properties
            const mappedArticle = mapDatabaseArticleToArticle({
              ...article,
              // Ensure cover_image property exists for the mapping function
              cover_image: article.image_url
            });
            
            // Then add RHCA-specific properties
            return {
              ...mappedArticle,
              pdfFileName: article.pdf_filename || undefined,
              coverImageFileName: article.cover_image_filename || undefined
            } as RhcaArticle;
          });
          
          console.log(`[RHCA:INFO] Processed ${mappedArticles.length} articles`);
          setArticles(mappedArticles);
        } else {
          console.warn('[RHCA:WARN] No data returned from rhca_articles_view');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`[RHCA:ERROR] Error in fetchRHCAArticles: ${errorMessage}`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
        console.log('[RHCA:INFO] Finished loading RHCA articles');
      }
    };

    fetchRHCAArticles();
  }, []);

  return { articles, loading, error };
};
