import { defaultStats } from "./stats/StatsData";
import { StatsCard } from "@/components/ui/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const StatsSection = () => {
  const { data: statsData, isLoading, error, refetch } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      console.log('Fetching home stats...');
      
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, views, citations');
      
      if (articlesError) throw articlesError;

      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id');
      
      if (membersError) throw membersError;

      const stats = [...defaultStats];
      
      // Update Publications count
      stats[0].value = articles?.length?.toString() || "0";
      
      // Update Members count
      stats[1].value = members?.length?.toString() || "0";
      
      // Update Views count
      const totalViews = articles?.reduce((sum, article) => sum + (article.views || 0), 0);
      stats[2].value = totalViews?.toString() || "0";
      
      // Update Citations count
      const totalCitations = articles?.reduce((sum, article) => sum + (article.citations || 0), 0);
      stats[3].value = totalCitations?.toString() || "0";

      console.log('Processed stats:', stats);
      return stats;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-white" aria-label="Statistiques">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <LoadingSpinner variant="fun" text="Chargement des statistiques" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-xl">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error fetching stats:', error);
    return (
      <section className="py-12 bg-white" aria-label="Erreur de chargement">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                  Une erreur est survenue lors du chargement des statistiques.
                </AlertDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Réessayer
            </Button>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white" aria-label="Statistiques">
      <div className="container mx-auto px-4">
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          role="list"
          aria-label="Liste des statistiques"
        >
          {(statsData || defaultStats).map((stat, index) => (
            <div key={index} role="listitem">
              <StatsCard {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
