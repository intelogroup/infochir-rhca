
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultStats } from "../StatsData";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useStatsData');

export const useStatsData = () => {
  const { 
    data: statsData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      logger.log('Fetching home stats...');
      
      // Get articles count
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, views');
      
      if (articlesError) throw articlesError;

      // Get members count
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id');
      
      if (membersError) throw membersError;
      
      // Get total downloads using the dedicated function
      const { data: downloads, error: downloadsError } = await supabase
        .rpc('get_total_downloads');
        
      if (downloadsError) {
        logger.error('Error fetching download count:', downloadsError);
        throw downloadsError;
      }

      logger.log('Raw downloads count:', downloads);

      const stats = [...defaultStats];
      
      // Don't override the first stat value since we've set it statically to 95
      
      // Update Members count
      stats[1].value = members?.length?.toString() || "0";
      
      // Update Views count
      const totalViews = articles?.reduce((sum, article) => sum + (article.views || 0), 0);
      stats[2].value = totalViews?.toString() || "0";
      
      // Update Downloads count
      stats[3].value = downloads?.toString() || "0";

      logger.log('Processed stats:', stats);
      return stats;
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
