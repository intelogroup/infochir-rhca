
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultStats } from "../StatsData";
import { createLogger } from "@/lib/error-logger";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeToDownloadStats } from "@/lib/analytics/download/statistics";

const logger = createLogger('useStatsData');

export const useStatsData = () => {
  const queryClient = useQueryClient();
  
  // Setup real-time subscription to download stats updates
  useEffect(() => {
    logger.log('Setting up real-time subscription to download stats');
    
    // Subscribe to download stats updates and invalidate query on changes
    const unsubscribe = subscribeToDownloadStats(() => {
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
        
        // Get total downloads using the dedicated function
        const { data: downloads, error: downloadsError } = await supabase
          .rpc('get_total_downloads');
          
        if (downloadsError) {
          logger.error('Error fetching download count:', downloadsError);
          throw downloadsError;
        }

        logger.log('Raw downloads count:', downloads);

        // As a fallback, query the download_stats_monitoring table directly
        if (downloads === null || downloads === undefined) {
          logger.log('Download count is null or undefined, querying download_stats_monitoring directly');
          const { data: downloadStats, error: downloadStatsError } = await supabase
            .from('download_stats_monitoring')
            .select('count')
            .eq('status', 'success');
            
          if (downloadStatsError) {
            logger.error('Error fetching download stats:', downloadStatsError);
          } else if (downloadStats && downloadStats.length > 0) {
            const totalDownloads = downloadStats.reduce((sum, stat) => sum + (stat.count || 0), 0);
            logger.log('Total downloads from download_stats_monitoring:', totalDownloads);
          }
        }

        const stats = [...defaultStats];
        
        // Don't override the first stat value since we've set it statically to 95
        
        // Update Members count
        stats[1].value = members?.length?.toString() || "0";
        
        // Update Views count
        const totalViews = articles?.reduce((sum, article) => sum + (article.views || 0), 0);
        stats[2].value = totalViews?.toString() || "0";
        
        // Update Downloads count - ensure we convert to string
        stats[3].value = downloads !== null && downloads !== undefined 
          ? downloads.toString() 
          : "0";

        logger.log('Processed stats:', stats);
        return stats;
      } catch (error) {
        logger.error('Error in stats data fetching:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep unused data in cache for 15 minutes
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
