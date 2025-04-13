
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultStats } from "../StatsData";
import { createLogger } from "@/lib/error-logger";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { 
  subscribeToDownloadStatsChanges, 
  getOverallDownloadStats 
} from "@/lib/analytics/download";

const logger = createLogger('useStatsData');

export const useStatsData = () => {
  const queryClient = useQueryClient();
  
  // Setup real-time subscription to download stats updates
  useEffect(() => {
    logger.log('Setting up real-time subscription to download stats');
    
    // Subscribe to download stats updates and invalidate query on changes
    const unsubscribe = subscribeToDownloadStatsChanges(() => {
      logger.log('Download stats updated, invalidating query');
      queryClient.invalidateQueries({ queryKey: ['home-stats'] });
    });
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, [queryClient]);

  const { 
    data: statsData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      logger.log('Fetching home stats...');
      
      try {
        // Get articles count
        const { data: articles, error: articlesError } = await supabase
          .from('articles')
          .select('id, views');
        
        if (articlesError) {
          logger.error('Error fetching articles:', articlesError);
          throw articlesError;
        }

        // Get members count
        const { data: members, error: membersError } = await supabase
          .from('members')
          .select('id');
        
        if (membersError) {
          logger.error('Error fetching members:', membersError);
          throw membersError;
        }
        
        // Get download statistics using the correct function name
        // This now uses the overall_download_stats_view
        const downloadStats = await getOverallDownloadStats();
        logger.log('Download stats fetched:', downloadStats);
        
        // Extract total downloads with fallback to 0
        const totalDownloads = downloadStats?.total_downloads || 0;
        logger.log('Total downloads:', totalDownloads);
        
        // Start with default stats
        const stats = [...defaultStats];
        
        // Don't override the first stat value since we've set it statically to 95
        
        // Update Members count
        stats[1].value = members?.length?.toString() || "0";
        
        // Update Views count
        const totalViews = articles?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;
        stats[2].value = totalViews.toString() || "0";
        
        // Update Downloads count from our new view
        stats[3].value = String(totalDownloads);

        logger.log('Processed stats:', stats);
        return stats;
      } catch (error) {
        logger.error('Error in stats data fetching:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    statsData: statsData || defaultStats,
    isLoading,
    error,
    refetch
  };
};
