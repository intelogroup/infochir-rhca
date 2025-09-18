
import { useQuery } from "@tanstack/react-query";
import { supabase, getADCCoverUrl } from "@/integrations/supabase/client";
import { generateAtlasImageAlternatives, findWorkingImageUrl } from "@/lib/image-validation";
import type { AtlasChapter } from "../types";
import { createMissingChapterPlaceholders, getCompleteChapterOrder } from "../utils/missingChapters";

// Define the exact order of chapters (1-23)
const CHAPTER_ORDER = [
  "TRAUMA – PLAIES - BRULURES",
  "PEAU ET TISSUS SOUS CUTANÉS - INFECTIONS - TUMEURS", 
  "SEIN",
  "NEURO CHIRURGIE",
  "OPHTALMO ORL CMF",
  "COU",
  "THORAX",
  "VASCULAIRE ARTÉRIEL – ANÉVRISMES",
  "VASCULAIRE VEINEUX ET LYMPHATIQUE",
  "DE L'ŒSOPHAGE, DIAPHRAGME À ILÉON",
  "DE APPENDICE À ANUS",
  "FOIE – VBHE – PANCRÉAS – RATE",
  "CAVITÉ ABDOMINALE – OMENTUM – MÉSENTÈRE – RÉTRO PÉRITOINE",
  "PAROI ABDOMINALE – HERNIES - ÉVENTRATION – ÉVISCÉRATION",
  "PÉRINÉE ET FESSES",
  "CHIRURGIE PÉDIATRIQUE",
  "UROLOGIE ET APPAREIL GÉNITAL DE L'HOMME",
  "OBGN ET APPAREIL GÉNITAL DE LA FEMME",
  "ORTHOPÉDIE – APPAREIL LOCO MOTEUR",
  "GIGANTISMES",
  "CORPS ÉTRANGERS",
  "CHIRURGIE RECONSTRUCTIVE"
];

export const useAtlasArticles = () => {
  return useQuery({
    queryKey: ['atlas-articles'],
    queryFn: async (): Promise<AtlasChapter[]> => {
      console.log("Fetching atlas articles from Supabase");
      
      const { data, error } = await supabase
        .from('adc_articles_view')
        .select('*')
        .eq('source', 'ADC')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching atlas articles:", error);
        throw error;
      }

      console.log("Atlas articles data:", data);

      if (!data || data.length === 0) {
        return [];
      }

      // Transform the data and sort by the predefined chapter order
      const chapters: AtlasChapter[] = await Promise.all(
        data.map(async (article) => {
          // Generate proper cover image URL for ADC articles
          let coverImageUrl = '';
          if (article.cover_image_filename) {
            try {
              coverImageUrl = getADCCoverUrl(article.cover_image_filename);
              console.log(`Generated primary ADC cover URL: ${coverImageUrl}`);
              
              // Try to find a working alternative if the primary URL might not work
              const alternatives = generateAtlasImageAlternatives(article.cover_image_filename);
              const workingUrl = await findWorkingImageUrl([coverImageUrl, ...alternatives]);
              
              if (workingUrl && workingUrl !== coverImageUrl) {
                console.log(`Found working alternative URL: ${workingUrl} for ${article.cover_image_filename}`);
                coverImageUrl = workingUrl;
              }
            } catch (error) {
              console.error(`Failed to generate ADC image URL: ${article.cover_image_filename}`, error);
            }
          } else if (article.image_url) {
            coverImageUrl = article.image_url;
          }

          return {
            id: article.id || '',
            title: article.title || '',
            description: article.abstract || '',
            abstract: article.abstract || '',
            lastUpdated: article.updated_at || article.created_at || '',
            publicationDate: article.publication_date || article.created_at || '',
            author: article.primary_author || (article.authors && article.authors[0]) || '',
            authors: article.authors || [],
            status: (article.status === 'published' ? 'available' : 'coming') as 'available' | 'coming' | 'coming-soon' | 'unavailable',
            coverImage: coverImageUrl,
            coverImageUrl: coverImageUrl, // Add both for compatibility
            pdfUrl: article.pdf_url || '',
            stats: {
              views: article.views || 0,
              shares: article.shares || 0,
              downloads: article.downloads || 0
            },
            source: 'ADC',
            tags: article.tags || [],
            issue: article.issue || '',
            volume: article.volume || '',
            specialty: article.specialty || '',
            category: article.category || '',
            institution: article.institution || '',
            chapterNumber: parseInt(article.issue || '0') || undefined,
            pageNumber: article.page_number || article.issue || ''
          };
        })
      );

      // Add missing chapter placeholders
      const missingChapters = createMissingChapterPlaceholders();
      const allChapters = [...chapters, ...missingChapters];
      
      // Sort chapters by chapter number (1-23)
      const sortedChapters = allChapters.sort((a, b) => {
        const chapterA = a.chapterNumber || parseInt(a.issue || '0') || 0;
        const chapterB = b.chapterNumber || parseInt(b.issue || '0') || 0;
        
        if (chapterA && chapterB) {
          return chapterA - chapterB;
        }
        
        // Fallback to alphabetical order by title
        return a.title.localeCompare(b.title);
      });

      console.log("Processed and sorted atlas chapters with placeholders:", sortedChapters);
      return sortedChapters;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
