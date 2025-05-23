import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import type { Article } from "@/components/index-medicus/types/article";
import type { ArticleSource } from "@/components/index-medicus/types";

const logger = createLogger('useRHCAArticles');

// Helper function to map database articles to our Article type
const mapDatabaseArticleToArticle = (item: any) => {
  // Convert from database format to our Article interface
  return {
    id: item.id,
    title: item.title,
    abstract: item.abstract,
    authors: item.authors || [],
    publicationDate: item.publication_date,
    source: item.source,
    pdfUrl: item.pdf_url,
    imageUrl: item.image_url,
    volume: item.volume,
    issue: item.issue,
    pageNumber: item.page_number,
    specialty: item.specialty,
    institution: item.institution,
    category: item.category,
    tags: item.tags || [],
    views: item.views,
    downloads: item.downloads,
    shares: item.shares,
    citations: item.citations,
    status: item.status
  };
};

interface UseRHCAArticlesProps {
  initialData?: Article[];
}

export const useRHCAArticles = ({ initialData }: UseRHCAArticlesProps = {}) => {
  return useQuery<Article[], Error>({
    queryKey: ['rhca-articles'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('source', 'RHCA');

        if (error) {
          logger.error('Error fetching RHCA articles:', error);
          throw error;
        }

        if (!data) {
          return [];
        }

        // Map the database results to our Article type
        const articles: Article[] = data.map(mapDatabaseArticleToArticle);
        return articles;
      } catch (error) {
        logger.error('Failed to fetch RHCA articles:', error);
        throw error;
      }
    },
    initialData: initialData,
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
