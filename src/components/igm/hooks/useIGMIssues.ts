
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Issue } from "../types";
import { toast } from "sonner";

export const useIGMIssues = () => {
  console.log('[useIGMIssues] Hook initializing');
  const startTime = Date.now();

  return useQuery({
    queryKey: ["igm-issues"],
    queryFn: async () => {
      console.log('[useIGMIssues] Starting data fetch at:', Date.now() - startTime, 'ms');

      try {
        // Fetch IGM articles from the articles table instead of igm_unified_view
        const { data, error } = await supabase
          .from("articles")
          .select('*')
          .eq('source', 'IGM')
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

        if (!data || data.length === 0) {
          console.log('[useIGMIssues] No data returned from Supabase');
          return [];
        }

        console.log('[useIGMIssues] Raw data from Supabase:', {
          count: data.length,
          firstItem: data[0],
          lastItem: data[data.length - 1]
        });

        // Group articles by volume and issue
        const issuesMap = new Map();

        data.forEach(article => {
          if (!article.volume || !article.issue) return;
          
          const key = `${article.volume}-${article.issue}`;
          
          if (!issuesMap.has(key)) {
            issuesMap.set(key, {
              id: `igm-${article.volume}-${article.issue}`,
              title: `IGM Volume ${article.volume}, No. ${article.issue}`,
              volume: article.volume,
              issue: article.issue,
              date: article.publication_date,
              abstract: article.abstract || "Information Gynéco-Médicale Volume " + article.volume + ", Numéro " + article.issue,
              pdfUrl: article.pdf_url || "",
              coverImage: article.image_url || "",
              articleCount: 0,
              downloads: article.downloads || 0,
              shares: article.shares || 0,
              articles: [],
              categories: article.category ? [article.category] : []
            });
          }
          
          // Add article to the issue
          const issue = issuesMap.get(key);
          issue.articles.push({
            id: article.id,
            title: article.title,
            authors: article.authors || [],
            pageNumber: article.page_number ? Number(article.page_number) : 0,
            abstract: article.abstract,
            tags: article.tags || []
          });
          
          issue.articleCount = issue.articles.length;
        });

        // Convert map to array
        const issues = Array.from(issuesMap.values());

        console.log('[useIGMIssues] Processed issues:', {
          count: issues.length,
          timing: Date.now() - startTime,
          'ms': 'since initialization',
          firstIssue: issues.length > 0 ? issues[0] : null
        });

        return issues;
      } catch (error) {
        console.error('[useIGMIssues] Error in query function:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timing: Date.now() - startTime
        });
        toast.error("Erreur lors du chargement des numéros", {
          description: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
        });
        throw error;
      }
    },
    meta: {
      errorMessage: "Erreur lors du chargement des numéros"
    }
  });
};
