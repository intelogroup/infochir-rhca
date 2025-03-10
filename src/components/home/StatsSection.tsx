
import { defaultStats } from "./stats/StatsData";
import { StatsCard } from "@/components/ui/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

export const StatsSection = () => {
  const { data: statsData, isLoading, error, refetch } = useQuery({
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

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-label="Statistiques">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <LoadingSpinner variant="fun" text="Chargement des statistiques" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-white shadow-sm rounded-xl">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
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
      <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-label="Erreur de chargement">
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
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-label="Statistiques">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nos chiffres clés
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            L'impact de notre travail en quelques statistiques
          </p>
        </motion.div>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          role="list"
          aria-label="Liste des statistiques"
        >
          {(statsData || defaultStats).map((stat, index) => (
            <motion.div 
              key={index} 
              role="listitem" 
              className="transform transition-transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
