import { sponsors } from "./sponsors/SponsorsData";
import { SponsorCard } from "./sponsors/SponsorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const SponsorsSection = () => {
  const { data: sponsorsData, isLoading, error } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      // Simulating a network request for demonstration
      await new Promise(resolve => setTimeout(resolve, 500)); // Reduced timeout for faster loading
      return sponsors;
    }
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50" aria-label="Partenaires">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50" aria-label="Erreur de chargement">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Une erreur est survenue lors du chargement des partenaires. Veuillez réessayer plus tard.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50" aria-label="Partenaires">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Partenaires
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les organisations qui soutiennent notre mission et contribuent à notre succès.
          </p>
        </div>
        <div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          role="list"
          aria-label="Liste des partenaires"
        >
          {sponsorsData.map((sponsor, index) => (
            <div key={index} role="listitem">
              <SponsorCard sponsor={sponsor} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};