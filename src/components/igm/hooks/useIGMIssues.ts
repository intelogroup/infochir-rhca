
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useIGMIssues');

export const useIGMIssues = () => {
  return useQuery({
    queryKey: ["igm-issues"],
    queryFn: async () => {
      try {
        logger.log('Fetching IGM articles from the database');
        
        // Fetch IGM articles from the articles table
        const { data, error } = await supabase
          .from("articles")
          .select('*')
          .eq('source', 'IGM')
          .order('publication_date', { ascending: false });

        if (error) {
          logger.error(error);
          toast.error("Erreur lors du chargement des numéros");
          throw error;
        }

        // Log years distribution for debugging
        const yearDistribution = data?.reduce((acc, article) => {
          if (!article.publication_date) return acc;
          
          try {
            const year = new Date(article.publication_date).getFullYear();
            if (isNaN(year)) return acc;
            
            acc[year] = (acc[year] || 0) + 1;
          } catch (e) {
            console.error("Error parsing date:", article.publication_date);
          }
          return acc;
        }, {});
        
        logger.log("Years distribution in IGM data:", yearDistribution);
        
        if (!data || data.length === 0) {
          logger.log('No IGM articles found in the database');
          return [];
        }

        logger.log(`Found ${data.length} IGM articles`);

        // Group articles by volume and issue
        const issuesMap = new Map();

        data.forEach(article => {
          if (!article.volume || !article.issue) return;
          
          const key = `${article.volume}-${article.issue}`;
          
          if (!issuesMap.has(key)) {
            // Use the exact title from the database if available
            const issueTitle = article.title || `INFO GAZETTE MÉDICALE Volume ${article.volume}, No. ${article.issue}`;
            
            // Ensure date is valid
            let pubDate = article.publication_date;
            try {
              // Validate the date
              const testDate = new Date(pubDate);
              if (isNaN(testDate.getTime())) {
                console.warn(`Invalid publication date for article ${article.id}: ${pubDate}`);
                // Try to extract year from volume as fallback
                const yearMatch = article.volume.match(/\d{4}/);
                if (yearMatch) {
                  pubDate = `${yearMatch[0]}-01-01`;
                  console.log(`Using fallback date for article ${article.id}: ${pubDate}`);
                }
              }
            } catch (e) {
              console.error("Error validating date", e);
            }
            
            issuesMap.set(key, {
              id: `igm-${article.volume}-${article.issue}`,
              title: issueTitle,
              volume: article.volume,
              issue: article.issue,
              date: pubDate,
              abstract: article.abstract || `Information Gynéco-Médicale Volume ${article.volume}, Numéro ${article.issue}`,
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

        // Convert map to array and log for debugging
        const issues = Array.from(issuesMap.values());
        
        // Debug log to check years
        const issueYears = issues.reduce((acc, issue) => {
          try {
            const year = new Date(issue.date).getFullYear();
            if (!isNaN(year)) {
              acc[year] = (acc[year] || 0) + 1;
            }
          } catch (e) {
            console.error("Error extracting year from issue date:", issue.date);
          }
          return acc;
        }, {});
        
        logger.log("Issue years distribution:", issueYears);
        
        return issues;
      } catch (error) {
        logger.error(error);
        toast.error("Erreur lors du chargement des numéros");
        throw error;
      }
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
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};
