
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtlasChapter } from "../types";

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
      const chapters: AtlasChapter[] = data
        .map((article) => ({
          id: article.id || '',
          title: article.title || '',
          description: article.abstract || '',
          abstract: article.abstract || '',
          lastUpdated: article.updated_at || article.created_at || '',
          publicationDate: article.publication_date || article.created_at || '',
          author: article.primary_author || (article.authors && article.authors[0]) || '',
          authors: article.authors || [],
          status: article.status === 'published' ? 'available' : 'coming',
          coverImage: article.image_url || article.cover_image_filename || '',
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
          institution: article.institution || ''
        }))
        .sort((a, b) => {
          // First try to sort by the predefined chapter order
          const aIndex = CHAPTER_ORDER.findIndex(chapter => 
            chapter.toLowerCase().includes(a.title.toLowerCase()) || 
            a.title.toLowerCase().includes(chapter.toLowerCase())
          );
          const bIndex = CHAPTER_ORDER.findIndex(chapter => 
            chapter.toLowerCase().includes(b.title.toLowerCase()) || 
            b.title.toLowerCase().includes(chapter.toLowerCase())
          );
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          
          // If not found in predefined order, try to sort by issue number
          if (a.issue && b.issue) {
            const aIssueNum = parseInt(a.issue);
            const bIssueNum = parseInt(b.issue);
            if (!isNaN(aIssueNum) && !isNaN(bIssueNum)) {
              return aIssueNum - bIssueNum;
            }
          }
          
          // Fallback to alphabetical order
          return a.title.localeCompare(b.title);
        });

      console.log("Processed and sorted atlas chapters:", chapters);
      return chapters;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
