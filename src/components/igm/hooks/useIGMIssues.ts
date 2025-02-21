
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Issue, DatabaseIssue } from "../types";
import { toast } from "sonner";

export const useIGMIssues = () => {
  console.log('[useIGMIssues] Hook initializing');
  const startTime = Date.now();

  return useQuery({
    queryKey: ["igm-issues"],
    queryFn: async () => {
      console.log('[useIGMIssues] Starting data fetch at:', Date.now() - startTime, 'ms');

      try {
        const { data, error } = await supabase
          .from("igm_unified_view")
          .select('*')
          .order('publication_date', { ascending: false });

        console.log('[useIGMIssues] Supabase query completed at:', Date.now() - startTime, 'ms');

        if (error) {
          console.error("[useIGMIssues] Supabase error:", {
            error,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          toast.error("Erreur lors du chargement des numéros", {
            description: error.message
          });
          throw error;
        }

        if (!data) {
          console.log('[useIGMIssues] No data returned from Supabase');
          return [];
        }

        console.log('[useIGMIssues] Raw data from Supabase:', {
          count: data.length,
          firstItem: data[0],
          lastItem: data[data.length - 1]
        });

        const issues = data.map((item: DatabaseIssue) => {
          let dateString: string;

          if (item.publication_date instanceof Date) {
            dateString = item.publication_date.toISOString();
          } else {
            const parsedDate = new Date(item.publication_date);
            dateString = parsedDate.toISOString();
          }

          return {
            id: item.id,
            title: item.title,
            volume: item.volume,
            issue: item.issue,
            date: dateString,
            abstract: item.abstract,
            coverImage: item.cover_image || undefined,
            articleCount: item.article_count,
            downloads: item.downloads,
            shares: item.shares,
            articles: item.articles.map(article => ({
              id: article.id,
              title: article.title,
              authors: article.authors,
              pageNumber: Number(article.pageNumber) || 0,
              abstract: article.abstract,
              tags: article.tags
            })),
            categories: item.category ? [item.category] : []
          };
        });

        console.log('[useIGMIssues] Mapped issues:', {
          count: issues.length,
          timing: Date.now() - startTime,
          'ms': 'since initialization'
        });

        return issues;
      } catch (error) {
        console.error('[useIGMIssues] Error in query function:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timing: Date.now() - startTime
        });
        throw error;
      }
    },
    meta: {
      errorMessage: "Erreur lors du chargement des numéros"
    }
  });
};
