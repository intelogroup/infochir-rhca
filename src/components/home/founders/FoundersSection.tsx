
import { motion } from "framer-motion";
import { useState } from "react";
import { FounderCard } from "./FounderCard";
import { FoundersSectionHeader } from "./FoundersSectionHeader";
import { FounderModal } from "./FounderModal";
import { useFounders } from "@/hooks/useFounders";
import type { Founder } from "@/hooks/useFounders";
import { Skeleton } from "@/components/ui/skeleton";

export const FoundersSection = () => {
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  const { founders, loading, error } = useFounders();

  if (error) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xl text-destructive">Une erreur est survenue lors du chargement des fondateurs</div>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-light transition-colors"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="section"
      aria-label="Membres fondateurs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FoundersSectionHeader />

        {loading ? (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            role="status"
            aria-label="Chargement des membres fondateurs"
          >
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-card rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <Skeleton className="h-64 w-full" />
                </div>
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            role="list"
            aria-label="Liste des membres fondateurs"
          >
            {/* First show non-deceased founders */}
            {founders
              .filter(founder => !founder.isDeceased)
              .map((founder, index) => (
                <motion.div
                  key={founder.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  role="listitem"
                >
                  <FounderCard 
                    founder={founder}
                    onClick={() => setSelectedFounder(founder)}
                  />
                </motion.div>
              ))}
            
            {/* Show deceased founders in a separate section */}
            {founders.filter(founder => founder.isDeceased).length > 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mt-16">
                <h3 className="type-h2 mb-8 text-center text-foreground/80">In Memoriam</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {founders
                    .filter(founder => founder.isDeceased)
                    .map((founder, index) => (
                      <motion.div
                        key={founder.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        role="listitem"
                      >
                        <FounderCard 
                          founder={founder}
                          onClick={() => setSelectedFounder(founder)}
                          memorialStyle
                        />
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
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
