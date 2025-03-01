
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { RhcaArticle } from "../types";
import { toast } from "sonner";

export const useRHCAArticles = () => {
  console.log('[useRHCAArticles] Hook initializing');
  const startTime = Date.now();

  return useQuery({
    queryKey: ["rhca-articles"],
    queryFn: async () => {
      console.log('[useRHCAArticles] Starting data fetch at:', Date.now() - startTime, 'ms');

      try {
        const { data, error } = await supabase
          .from("rhca_articles_view")
          .select('*')
          .order('publication_date', { ascending: false });

        console.log('[useRHCAArticles] Supabase query completed at:', Date.now() - startTime, 'ms');

        if (error) {
          console.error("[useRHCAArticles] Supabase error:", {
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
          console.log('[useRHCAArticles] No data returned from Supabase');
          return [];
        }

        console.log('[useRHCAArticles] Raw data from Supabase:', {
          count: data.length,
          firstItem: data[0],
          lastItem: data[data.length - 1]
        });

        const articles: RhcaArticle[] = data.map((item: any) => {
          // Convert date strings to ISO format for consistency
          const publicationDate = new Date(item.publication_date).toISOString();
          
          return {
            id: item.id,
            title: item.title,
            abstract: item.abstract || "",
            authors: Array.isArray(item.authors) ? item.authors : [],
            publicationDate: publicationDate,
            date: publicationDate,
            specialty: item.specialty || "",
            category: item.category || "",
            source: item.source || "RHCA",
            volume: item.volume || "",
            issue: item.issue || "",
            pageNumber: parseInt(item.page_number) || 0,
            views: item.views || 0,
            downloads: item.downloads || 0,
            shares: item.shares || 0,
            citations: item.citations || 0,
            tags: Array.isArray(item.tags) ? item.tags : [],
            imageUrl: item.image_url || undefined,
            pdfUrl: item.pdf_url || undefined,
            status: item.status || "published",
            institution: item.institution || "",
            userId: item.user_id || undefined,
            articleType: item.article_type || "RHCA",
            pdfFileName: item.pdf_url ? item.pdf_url.split('/').pop() : undefined
          };
        });

        console.log('[useRHCAArticles] Mapped articles:', {
          count: articles.length,
          timing: Date.now() - startTime,
          'ms': 'since initialization'
        });

        return articles;
      } catch (error) {
        console.error('[useRHCAArticles] Error in query function:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timing: Date.now() - startTime
        });
        throw error;
      }
    },
    meta: {
      errorMessage: "Erreur lors du chargement des articles"
    }
  });
};
