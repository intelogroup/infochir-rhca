
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RhcaArticle } from '../types';
import { mapDatabaseArticleToArticle } from '@/components/index-medicus/types';

export const useRHCAArticles = () => {
  const [articles, setArticles] = useState<RhcaArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRHCAArticles = async () => {
      try {
        setLoading(true);
        // Use the view we created to get articles with cover_image_filename
        const { data, error } = await supabase
          .from('rhca_articles_view')
          .select('*')
          .order('publication_date', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const mappedArticles = data.map(article => {
            // First map the base article properties
            const mappedArticle = mapDatabaseArticleToArticle({
              ...article,
              // Ensure cover_image property exists for the mapping function
              cover_image: article.image_url
            });
            
            // Then add RHCA-specific properties
            return {
              ...mappedArticle,
              pdfFileName: article.pdf_filename,
              coverImageFileName: article.cover_image_filename
            } as RhcaArticle;
          });
          
          setArticles(mappedArticles);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error fetching RHCA articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRHCAArticles();
  }, []);

  return { articles, loading, error };
};
