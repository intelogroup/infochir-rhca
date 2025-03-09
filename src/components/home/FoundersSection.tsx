
import { useState, useEffect } from "react";
import { useFounders, Founder } from "@/hooks/useFounders";
import { FounderModal } from "./founders/FounderModal";
import { createLogger } from "@/lib/error-logger";
import { FoundersLoading } from "./founders/FoundersLoading";
import { FoundersError } from "./founders/FoundersError";
import { FoundersEmpty } from "./founders/FoundersEmpty";
import { FoundersSectionHeader } from "./founders/FoundersSectionHeader";
import { FoundersGrid } from "./founders/FoundersGrid";

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
        <FoundersLoading />
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
        <FoundersError error={error} />
      </section>
    );
  }

  if (founders.length === 0) {
    return (
      <section className="py-24 relative overflow-hidden">
        <FoundersEmpty />
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
        <FoundersSectionHeader />

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          role="list"
          aria-label="Liste des membres fondateurs"
        >
          <FoundersGrid 
            founders={nonDeceasedFounders} 
            onSelectFounder={setSelectedFounder} 
          />
          
          {deceasedFounders.length > 0 && (
            <FoundersGrid 
              founders={deceasedFounders} 
              onSelectFounder={setSelectedFounder} 
              isDeceased={true}
            />
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
