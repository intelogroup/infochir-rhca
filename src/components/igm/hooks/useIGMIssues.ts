
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Issue, DatabaseIssue } from "../types";
import { toast } from "sonner";
import { mapDatabaseIssueToIssue } from "../types";

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

        if (!data || data.length === 0) {
          console.log('[useIGMIssues] No data returned from Supabase');
          return [];
        }

        console.log('[useIGMIssues] Raw data from Supabase:', {
          count: data.length,
          firstItem: data[0],
          lastItem: data[data.length - 1]
        });

        // Process the issue data with standardized bucket references
        const issues = data.map((item) => {
          const mappedIssue = mapDatabaseIssueToIssue(item as DatabaseIssue);
          
          // Process coverImage URL if it's a filename rather than a full URL
          if (mappedIssue.coverImage && !mappedIssue.coverImage.startsWith('http')) {
            const { data: coverData } = supabase.storage
              .from('igm_covers')
              .getPublicUrl(mappedIssue.coverImage);
              
            mappedIssue.coverImage = coverData.publicUrl;
          }
          
          // Process PDF URL using standard naming convention if needed
          if (!mappedIssue.pdfUrl && mappedIssue.volume && mappedIssue.issue) {
            const pdfFilename = `IGM_vol_${mappedIssue.volume.padStart(2, '0')}_no_${mappedIssue.issue}.pdf`;
            const { data: pdfData } = supabase.storage
              .from('igm-pdfs')
              .getPublicUrl(pdfFilename);
              
            mappedIssue.pdfUrl = pdfData.publicUrl;
          }
          
          return mappedIssue;
        });

        console.log('[useIGMIssues] Mapped issues with URLs:', {
          count: issues.length,
          timing: Date.now() - startTime,
          'ms': 'since initialization',
          firstIssue: issues[0]
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
