
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultStats } from "../StatsData";

export const useStatsData = () => {
  const { 
    data: statsData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      console.log('Fetching home stats...');
      
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, views');
      
      if (articlesError) throw articlesError;

      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id');
      
      if (membersError) throw membersError;
      
      // Get total downloads
      const { data: downloads, error: downloadsError } = await supabase
        .rpc('get_total_downloads');
        
      if (downloadsError) throw downloadsError;

      const stats = [...defaultStats];
      
      // Don't override the first stat value since we've set it statically to 95
      
      // Update Members count
      stats[1].value = members?.length?.toString() || "0";
      
      // Update Views count
      const totalViews = articles?.reduce((sum, article) => sum + (article.views || 0), 0);
      stats[2].value = totalViews?.toString() || "0";
      
      // Update Downloads count
      stats[3].value = downloads?.toString() || "0";

      console.log('Processed stats:', stats);
      return stats;
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
