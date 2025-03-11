
import { useQuery } from "@tanstack/react-query";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import type { AtlasChapter } from "../types";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useAtlasArticles');

// Detect if we're in preview mode for improved error handling
const isPreviewMode = 
  typeof window !== 'undefined' && 
  (window.location.hostname.includes('preview') || 
   window.location.hostname.includes('lovable.app')) ||
  import.meta.env.VITE_APP_PREVIEW === 'true';

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
          // Process cover image with correct bucket
          let coverImage = '';
          
          if (item.cover_image_filename) {
            try {
              // Create direct URL to atlas_covers bucket
              const filename = item.cover_image_filename;
              
              // Make sure we're using the correct file extension
              const filenameWithCorrectExt = filename.endsWith('.jpg') 
                ? filename 
                : filename.replace(/\.\w+$/, '.jpg');
                
              coverImage = `${SUPABASE_URL}/storage/v1/object/public/atlas_covers/${filenameWithCorrectExt}`;
              
              logger.log(`Using direct image URL for ${item.id}: ${coverImage}`);
              
              // Add a cache buster in preview mode
              if (isPreviewMode && coverImage) {
                coverImage = `${coverImage}?t=${Date.now()}`;
              }
            } catch (imageError) {
              logger.error(`Failed to generate image URL for ${item.cover_image_filename}`, imageError);
              coverImage = item.image_url || '';
            }
          } else if (item.image_url) {
            coverImage = item.image_url;
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
        
        // For CORS errors or network failures, return empty array instead of throwing
        if (error instanceof Error && 
           (error.message.includes('NetworkError') || 
            error.message.includes('CORS') || 
            error.message.includes('CORB'))) {
          
          logger.warn('Returning empty array due to network/CORS/CORB error');
          
          if (isPreviewMode) {
            logger.warn('CORS issues are more common in preview environments.');
          }
          
          return [];
        }
        
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: isPreviewMode ? 1 : 2, // Fewer retries in preview mode
  });
};
