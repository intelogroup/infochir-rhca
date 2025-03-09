
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { highlights } from "@/components/home/carousel/carouselData";
import { CarouselItem } from "./types";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useCarouselData');

export const useCarouselData = () => {
  return useQuery({
    queryKey: ['carousel-highlights'],
    queryFn: async () => {
      logger.debug('Fetching carousel highlights for IGM, RHCA, and ADC sources...');
      
      // Get the latest article from each source (IGM, RHCA, ADC)
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .in('source', ['IGM', 'RHCA', 'ADC'])
        .order('publication_date', { ascending: false });

      if (error) throw error;

      if (!articles || articles.length === 0) {
        logger.debug('No articles found, falling back to highlights');
        return highlights;
      }

      // Group by source to get the latest of each
      const sourceMap = new Map();
      
      articles.forEach(article => {
        const source = article.source;
        if (!sourceMap.has(source)) {
          sourceMap.set(source, article);
        }
      });
      
      // Convert map to array of latest articles (one per source)
      const latestArticles = Array.from(sourceMap.values());
      
      logger.debug(`Found ${latestArticles.length} latest articles from specified sources`);

      return latestArticles.map(article => ({
        title: article.title,
        description: article.abstract,
        image: article.image_url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
        date: new Date(article.publication_date).toLocaleDateString('fr-FR'),
        category: article.source,
        author: article.authors ? article.authors.join(', ') : undefined,
        link: `/articles/${article.id}`,
      })) as CarouselItem[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
