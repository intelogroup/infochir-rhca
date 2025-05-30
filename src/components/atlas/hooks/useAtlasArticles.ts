
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createLogger } from '@/lib/error-logger';
import { AtlasChapter } from '../types';
import { getADCCoverUrl } from '@/integrations/supabase/client';

const logger = createLogger('useAtlasArticles');

export const useAtlasArticles = () => {
  return useQuery({
    queryKey: ['atlas-articles'],
    queryFn: async () => {
      try {
        // Fetch atlas chapters from the articles table, ordered by issue/page number
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('source', 'ADC')
          .order('page_number', { ascending: true })
          .order('created_at', { ascending: true });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Transform the data to match AtlasChapter type
        const chapters: AtlasChapter[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.abstract,
          category: item.category || undefined,
          chapterNumber: item.page_number ? parseInt(item.page_number, 10) : undefined,
          pageNumber: item.page_number || undefined,
          authors: item.authors || [],
          author: item.primary_author || undefined,
          pdfUrl: item.pdf_url || undefined,
          coverImageUrl: item.image_url ? getADCCoverUrl(item.image_url) : undefined,
          coverImage: item.cover_image_filename ? getADCCoverUrl(item.cover_image_filename) : undefined,
          lastUpdate: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : undefined,
          lastUpdated: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : undefined,
          publicationDate: item.publication_date ? new Date(item.publication_date).toISOString().split('T')[0] : undefined,
          abstract: item.abstract,
          status: (item.status === 'published' || item.status === 'available') ? 'available' : 
                 (item.status === 'coming-soon' || item.status === 'coming') ? 'coming-soon' : 'unavailable',
          tags: item.tags || [],
          stats: {
            views: item.views || 0,
            shares: item.shares || 0,
            downloads: item.downloads || 0
          },
          source: item.source,
          primary_author: item.primary_author,
          co_authors: item.co_authors || []
        }));
        
        logger.log(`Fetched ${chapters.length} atlas chapters from Supabase, ordered by issue number`);
        return chapters;
      } catch (error) {
        logger.error('Error fetching Atlas articles:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
};
