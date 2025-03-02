
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

export const useRHCAArticles = () => {
  const [articles, setArticles] = useState<RhcaArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRHCAArticles = async () => {
      try {
        setLoading(true);
        console.log('[RHCA:INFO] Fetching RHCA articles from database');
        
        // Use the articles table directly instead of the view to ensure we get all fields
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('source', 'RHCA')
          .order('publication_date', { ascending: false });

        if (error) {
          console.error('[RHCA:ERROR] Error fetching RHCA articles:', error);
          throw error;
        }

        if (data) {
          console.log(`[RHCA:INFO] Retrieved ${data.length} RHCA articles`);
          
          // Log first article for debugging column names
          if (data.length > 0) {
            console.log('[RHCA:DEBUG] Sample article data:', data[0]);
            console.log('[RHCA:DEBUG] Available columns:', Object.keys(data[0]));
          }
          
          const mappedArticles = data.map((article: any) => {
            console.log(`[RHCA:DEBUG] Processing article: ${article.id}, title: ${article.title}`);
            
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
              
              console.log(`[RHCA:DEBUG] Generated cover image filename: ${coverImageFilename}`);
            }
            
            // Ensure required fields have default values to match DatabaseArticle type
            const articleWithDefaults: RhcaDatabaseArticle = {
              ...article,
              // Ensure these fields are defined to match the DatabaseArticle type
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
              coverImageFileName: coverImageFilename || undefined
            } as RhcaArticle;
          });
          
          console.log(`[RHCA:INFO] Processed ${mappedArticles.length} articles`);
          setArticles(mappedArticles);
        } else {
          console.warn('[RHCA:WARN] No data returned from articles table');
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
