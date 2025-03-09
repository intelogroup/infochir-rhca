
import { useQuery } from "@tanstack/react-query";
import { supabase, getStorageUrl } from "@/integrations/supabase/client";
import type { AtlasChapter } from "../types";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useAtlasArticles');

export const useAtlasArticles = () => {
  return useQuery({
    queryKey: ["atlas-chapters"],
    queryFn: async () => {
      logger.log('Fetching Atlas chapters from articles table');
      
      try {
        const { data, error } = await supabase
          .from("articles")  // Using the articles table for ADC content
          .select("*")
          .eq('source', 'ADC')
          .order("publication_date", { ascending: false });

        if (error) {
          logger.error(error);
          throw error;
        }

        if (!data || data.length === 0) {
          logger.log('No ADC articles found in the articles table');
          return [];
        }

        logger.log(`Found ${data.length} ADC articles in the articles table`);

        const chapters: AtlasChapter[] = data?.map(item => {
          // Handle cover image from Supabase storage if a filename is provided
          let coverImage = item.image_url || '';
          
          if (item.cover_image_filename) {
            coverImage = getStorageUrl('adc_covers', item.cover_image_filename);
            logger.log(`Using cover image from storage: ${coverImage}`);
          } else if (item.image_url) {
            logger.log(`Using external image URL: ${item.image_url}`);
          } else {
            logger.log(`No cover image found for article: ${item.id} - ${item.title}`);
          }
          
          return {
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
            coverImage: coverImage,
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
            imageUrls: [],
            institution: item.institution,
            userId: item.user_id
          };
        }) || [];

        return chapters;
      } catch (error) {
        // Log the error with more details
        logger.error(error);
        
        // For CORS errors or network failures, we return an empty array instead of throwing
        if (error instanceof Error && 
           (error.message.includes('NetworkError') || error.message.includes('CORS'))) {
          logger.warn('Returning empty array due to network/CORS error');
          return [];
        }
        
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};
