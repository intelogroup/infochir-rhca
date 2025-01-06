import { useState } from "react";
import { FounderCard } from "./FounderCard";
import { FounderModal } from "./FounderModal";
import { founders } from "./FoundersData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Founder } from "./types";

export const FoundersSection = () => {
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);

  const { data: foundersData, isLoading, error } = useQuery({
    queryKey: ['founders'],
    queryFn: async () => {
      // Simulating a network request for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      return founders;
    }
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50" aria-label="Fondateurs">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
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
              Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50" aria-label="Fondateurs">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Fondateurs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les visionnaires qui ont façonné Info CHIR et continuent d'inspirer notre mission.
          </p>
        </div>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Liste des fondateurs"
        >
          {foundersData.map((founder) => (
            <div key={founder.name} role="listitem">
              <FounderCard
                founder={founder}
                onClick={() => setSelectedFounder(founder)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedFounder && (
        <FounderModal
          founder={selectedFounder}
          isOpen={!!selectedFounder}
          onClose={() => setSelectedFounder(null)}
        />
      )}
    </section>
  );
};