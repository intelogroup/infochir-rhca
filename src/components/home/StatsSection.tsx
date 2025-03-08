
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
import React, { Suspense } from "react"; // Fix missing React import

// Separate data fetching component using suspense
const StatsData = ({ onStatsLoaded }) => {
  const { data: statsData, error, refetch } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      console.log('Fetching home stats...');
      
      // Use a single query with efficient SELECT
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('views, citations')
        .limit(500);
      
      if (articlesError) throw articlesError;

      // Fix: Use proper type for members query with count
      const { count: membersCount, error: membersError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });
      
      if (membersError) throw membersError;

      const stats = [...defaultStats];
      
      // Don't override the first stat value since we've set it statically to 95
      
      // Update Members count - now using count instead of fetching all records
      stats[1].value = (membersCount || 0).toString();
      
      // Update Views and Citations counts efficiently
      let totalViews = 0;
      let totalCitations = 0;
      
      if (articles) {
        for (const article of articles) {
          totalViews += article.views || 0;
          totalCitations += article.citations || 0;
        }
      }
      
      stats[2].value = totalViews.toString();
      stats[3].value = totalCitations.toString();

      console.log('Processed stats:', stats);
      return stats;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Call the callback when stats are loaded
  React.useEffect(() => {
    if (statsData) {
      onStatsLoaded?.(statsData);
    }
  }, [statsData, onStatsLoaded]);

  if (error) {
    console.error('Error fetching stats:', error);
    return (
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
    );
  }

  return (
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
  );
};

export const StatsSection = () => {
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
        
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-white shadow-sm rounded-xl">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            ))}
          </div>
        }>
          <StatsData onStatsLoaded={(stats) => {
            // Optional: We could trigger prefetching of other data here
            // when stats are loaded, creating a cascade of fetch operations
          }} />
        </Suspense>
      </div>
    </section>
  );
};
