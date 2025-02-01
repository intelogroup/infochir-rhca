import { stats } from "./stats/StatsData";
import { StatsCard } from "@/components/ui/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const StatsSection = () => {
  const { data: statsData, isLoading, error, refetch } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      console.log('Fetching stats data');
      // Simulating a network request for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      return stats;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    retry: 2, // Only retry failed requests twice
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Prefetch data when component mounts
  useEffect(() => {
    const prefetchData = async () => {
      await refetch();
    };
    prefetchData();
  }, [refetch]);

  if (isLoading) {
    return (
      <section className="py-12 bg-white" aria-label="Statistiques">
        <div className="container mx-auto px-4">
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
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Une erreur est survenue lors du chargement des statistiques. 
              <button 
                onClick={() => refetch()} 
                className="ml-2 underline hover:text-primary"
              >
                Réessayer
              </button>
            </AlertDescription>
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
          {statsData?.map((stat, index) => (
            <div key={index} role="listitem">
              <StatsCard {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};