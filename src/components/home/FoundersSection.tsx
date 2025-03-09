
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FounderCard } from "./founders/FounderCard";
import { FounderModal } from "./founders/FounderModal";
import { useFounders } from "@/hooks/useFounders";
import { Founder } from "@/hooks/useFounders";
import { createLogger } from "@/lib/error-logger";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Create a logger for the FoundersSection
const logger = createLogger('FoundersSection');

export const FoundersSection = () => {
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  const { founders, loading, error } = useFounders();

  // Log component lifecycle and state changes
  useEffect(() => {
    logger.info('FoundersSection mounted');
    return () => {
      logger.info('FoundersSection unmounted');
    };
  }, []);

  useEffect(() => {
    if (loading) {
      logger.info('Founders loading...');
    } else if (error) {
      logger.error(error, { 
        context: 'FoundersSection rendering error',
        details: error.message
      });
    } else {
      logger.info(`Founders loaded: ${founders.length} founders`);
      
      // Log deceased vs non-deceased counts
      const deceasedCount = founders.filter(f => f.isDeceased).length;
      logger.info(`Founders breakdown: ${founders.length - deceasedCount} active, ${deceasedCount} deceased`);
      
      // Log display order for debugging
      logger.debug('Display order:', founders.map(f => `${f.name}: ${f.displayOrder}`));
    }
  }, [loading, error, founders]);

  // Log founder selection
  useEffect(() => {
    if (selectedFounder) {
      logger.info(`Founder selected: ${selectedFounder.name}`);
    }
  }, [selectedFounder]);

  if (loading) {
    return (
      <section className="py-24 relative overflow-hidden" aria-label="Membres fondateurs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LoadingSpinner 
            text="Chargement des membres fondateurs..." 
            variant="medical"
            size="lg"
          />
        </div>
      </section>
    );
  }

  if (error) {
    logger.error(error, { 
      context: 'Rendering error state',
      message: error.message,
      stack: error.stack
    });
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Une erreur est survenue lors du chargement des fondateurs: {error.message}
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (founders.length === 0) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Alert className="mb-6">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Aucune information sur les fondateurs n'est disponible pour le moment.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  // Separate founders into active and deceased
  const nonDeceasedFounders = founders.filter(founder => !founder.isDeceased);
  const deceasedFounders = founders.filter(founder => founder.isDeceased);

  logger.info(`Rendering founders section with ${nonDeceasedFounders.length} active and ${deceasedFounders.length} deceased founders`);

  return (
    <section 
      className="py-24 relative overflow-hidden"
      aria-label="Membres fondateurs"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#41b06e] to-[#41b06e] opacity-5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Star 
              className="w-8 h-8 text-[#1E40AF] animate-pulse" 
              aria-hidden="true"
            />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#1E40AF] via-[#41b06e] to-[#41b06e] bg-clip-text text-transparent">
              Membres Fondateurs
            </h2>
            <Star 
              className="w-8 h-8 text-[#1E40AF] animate-pulse" 
              aria-hidden="true"
            />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            En 2011, ces médecins visionnaires se sont réunis pour créer Info CHIR, donnant naissance à une organisation dédiée à l'avancement de la chirurgie et de l'anesthésiologie en Haïti.
          </motion.p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          role="list"
          aria-label="Liste des membres fondateurs"
        >
          {nonDeceasedFounders.map((founder, index) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              role="listitem"
            >
              <FounderCard 
                founder={founder}
                onClick={() => {
                  logger.info(`Founder card clicked: ${founder.name}`);
                  setSelectedFounder(founder);
                }}
              />
            </motion.div>
          ))}
          
          {/* Center the deceased members */}
          {deceasedFounders.length > 0 && (
            <>
              <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mt-8 mb-4 text-center">
                <h3 className="text-xl font-semibold text-gray-700">In Memoriam</h3>
              </div>
              <div className={`col-span-1 ${deceasedFounders.length === 1 ? 'md:col-span-2 lg:col-span-3 xl:col-span-4' : ''} grid grid-cols-1 ${deceasedFounders.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''} gap-8`}>
                {deceasedFounders.map((founder, index) => (
                  <motion.div
                    key={founder.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (nonDeceasedFounders.length + index) * 0.1 }}
                    viewport={{ once: true }}
                    role="listitem"
                  >
                    <FounderCard 
                      founder={founder}
                      onClick={() => {
                        logger.info(`Deceased founder card clicked: ${founder.name}`);
                        setSelectedFounder(founder);
                      }}
                      memorialStyle={true}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedFounder && (
        <FounderModal
          founder={selectedFounder}
          isOpen={!!selectedFounder}
          onClose={() => {
            logger.info(`Closing modal for: ${selectedFounder.name}`);
            setSelectedFounder(null);
          }}
        />
      )}
    </section>
  );
};
