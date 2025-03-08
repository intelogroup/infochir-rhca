
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Issue } from "../types";
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useIGMIssues');

export const useIGMIssues = () => {
  logger.log('Hook initializing');
  const startTime = Date.now();

  return useQuery({
    queryKey: ["igm-issues"],
    queryFn: async () => {
      logger.log(`Starting data fetch at: ${Date.now() - startTime}ms`);

      try {
        // Use a more efficient query with specific SELECT fields
        // and LIMIT to reduce data transfer
        const { data, error } = await supabase
          .from("articles")
          .select(`
            id, 
            title, 
            abstract, 
            volume, 
            issue, 
            publication_date, 
            authors, 
            tags, 
            downloads, 
            shares, 
            pdf_url, 
            image_url, 
            category, 
            page_number
          `)
          .eq('source', 'IGM')
          .order('publication_date', { ascending: false })
          // Add a reasonable limit to prevent loading too much data at once
          .limit(50);

        logger.log(`Supabase query completed at: ${Date.now() - startTime}ms`);

        if (error) {
          logger.error('Supabase query error', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          
          toast.error("Erreur lors du chargement des numéros", {
            description: error.message
          });
          throw error;
        }

        if (!data || data.length === 0) {
          logger.log('No data returned from Supabase');
          return [];
        }

        logger.log('Raw data from Supabase:', {
          count: data.length,
          firstItem: data[0],
          lastItem: data[data.length - 1]
        });

        // Group articles by volume and issue using a more efficient approach
        const issuesMap = {};

        data.forEach(article => {
          if (!article.volume || !article.issue) return;
          
          const key = `${article.volume}-${article.issue}`;
          
          if (!issuesMap[key]) {
            // Use the exact title from the database if available
            const issueTitle = article.title || `INFO GAZETTE MÉDICALE Volume ${article.volume}, No. ${article.issue}`;
            
            issuesMap[key] = {
              id: `igm-${article.volume}-${article.issue}`,
              title: issueTitle,
              volume: article.volume,
              issue: article.issue,
              date: article.publication_date,
              abstract: article.abstract || `Information Gynéco-Médicale Volume ${article.volume}, Numéro ${article.issue}`,
              pdfUrl: article.pdf_url || "",
              coverImage: article.image_url || "",
              articleCount: 0,
              downloads: article.downloads || 0,
              shares: article.shares || 0,
              articles: [],
              categories: article.category ? [article.category] : []
            };
          }
          
          // Add article to the issue
          const issue = issuesMap[key];
          issue.articles.push({
            id: article.id,
            title: article.title,
            authors: article.authors || [],
            pageNumber: article.page_number ? parseInt(article.page_number, 10) || 0 : 0,
            abstract: article.abstract,
            tags: article.tags || []
          });
          
          issue.articleCount = issue.articles.length;
          
          // If the current article has a more detailed abstract, use it for the issue
          if (article.abstract && 
             (issue.abstract.startsWith("Information Gynéco-Médicale Volume") || 
              article.abstract.length > issue.abstract.length)) {
            issue.abstract = article.abstract;
          }
        });

        // Convert map to array
        const issues = Object.values(issuesMap);

        logger.log('Processed issues:', {
          count: issues.length,
          timing: Date.now() - startTime,
          'ms': 'since initialization',
          firstIssue: issues.length > 0 ? issues[0] : null
        });

        return issues;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        logger.error('Error in data fetch', {
          message: errorMessage,
          stack: errorStack,
          timing: Date.now() - startTime
        });
        
        toast.error("Erreur lors du chargement des numéros", {
          description: errorMessage
        });
        throw error;
      }
    },
    meta: {
      errorMessage: "Erreur lors du chargement des numéros"
    },
    retry: (failureCount, error) => {
      // Only retry network/timeout errors, not data errors
      if (error instanceof Error && 
          (error.message.includes('network') || 
           error.message.includes('timeout'))) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
