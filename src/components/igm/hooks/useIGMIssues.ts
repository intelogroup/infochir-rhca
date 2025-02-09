
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Issue } from "../types";
import { toast } from "sonner";

const mapDatabaseIssueToIssue = (dbIssue: any): Issue => {
  console.log('[useIGMIssues] Mapping database issue:', dbIssue);
  
  return {
    id: dbIssue.id,
    title: dbIssue.title,
    volume: dbIssue.volume || '',
    issue: dbIssue.issue || '',
    date: new Date(dbIssue.publication_date).toISOString(),
    abstract: dbIssue.abstract || '',
    pdfUrl: dbIssue.pdf_url,
    coverImage: dbIssue.cover_image,
    articleCount: (dbIssue.article_files?.length || 0),
    downloads: dbIssue.downloads || 0,
    shares: dbIssue.shares || 0,
    articles: dbIssue.article_files?.map((article: any, index: number) => ({
      id: `${dbIssue.id}-${index}`,
      title: article.title || '',
      authors: article.authors || [],
      pageNumber: article.page_number || 1,
      abstract: article.abstract,
      tags: article.tags || []
    })) || [],
    categories: dbIssue.category ? [dbIssue.category] : []
  };
};

export const useIGMIssues = () => {
  console.log('[useIGMIssues] Hook initializing');
  const startTime = Date.now();

  return useQuery({
    queryKey: ["igm-issues"],
    queryFn: async () => {
      console.log('[useIGMIssues] Starting data fetch at:', Date.now() - startTime, 'ms');

      try {
        const { data, error } = await supabase
          .from("igm_issues_view")
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

        const issues = data.map(mapDatabaseIssueToIssue);

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
