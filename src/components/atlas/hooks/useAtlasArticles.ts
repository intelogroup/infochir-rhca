
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtlasChapter } from "../types";
import { toast } from "sonner";

export const useAtlasArticles = () => {
  console.log('[useAtlasArticles] Hook initializing');
  const startTime = Date.now();
  
  const queryFn = async () => {
    console.log('[useAtlasArticles] Starting data fetch at:', Date.now() - startTime, 'ms');
    
    try {
      const { data, error } = await supabase
        .from("adc_articles_view")
        .select('*')
        .eq('source', 'ADC')
        .order('created_at', { ascending: false });

      console.log('[useAtlasArticles] Supabase query completed at:', Date.now() - startTime, 'ms');

      if (error) {
        console.error("[useAtlasArticles] Supabase error:", {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        toast.error("Erreur lors du chargement des articles", {
          description: error.message
        });
        throw error;
      }

      if (!data) {
        console.log('[useAtlasArticles] No data returned from Supabase at:', Date.now() - startTime, 'ms');
        return [];
      }

      console.log('[useAtlasArticles] Raw data from Supabase:', {
        count: data.length,
        firstItem: data[0],
        lastItem: data[data.length - 1]
      });

      // Map database articles to AtlasChapter format
      const atlasChapters: AtlasChapter[] = data.map((article) => ({
        id: article.id,
        title: article.title,
        description: article.abstract,
        lastUpdate: new Date(article.publication_date || article.created_at).toLocaleDateString('fr-FR'),
        author: article.primary_author,
        status: "available",
        coverImage: article.image_url || undefined,
        stats: {
          views: article.views || 0,
          downloads: article.downloads || 0,
          shares: article.shares || 0
        },
        tags: article.tags || []
      }));

      console.log('[useAtlasArticles] Mapped atlas chapters:', {
        count: atlasChapters.length,
        timing: Date.now() - startTime,
        'ms': 'since initialization'
      });
      
      return atlasChapters;
    } catch (error) {
      console.error('[useAtlasArticles] Error in query function:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timing: Date.now() - startTime
      });
      throw error;
    }
  };

  return useQuery({
    queryKey: ["atlas-articles"],
    queryFn,
    meta: {
      errorMessage: "Erreur lors du chargement des articles"
    }
  });
};
