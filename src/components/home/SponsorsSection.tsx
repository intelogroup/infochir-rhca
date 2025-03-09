
// Import the required dependencies and components
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SponsorCard } from './sponsors/SponsorCard';
import { createLogger } from '@/lib/error-logger';
import { sponsors } from './sponsors/SponsorsData';

// Create a logger for the sponsors section
const logger = createLogger('SponsorsSection');

export const SponsorsSection = () => {
  const [sponsorsList, setSponsors] = useState(sponsors);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSponsors = async () => {
      logger.info('Initializing sponsors data');
      setLoading(true);
      
      try {
        // Use the sponsors data directly from the local file
        setSponsors(sponsors);
        logger.info(`Loaded ${sponsors.length} sponsors successfully`);
      } catch (error) {
        // Log the error but don't crash the app
        logger.error('Error loading sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Partenaires
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nous remercions nos précieux partenaires qui rendent notre mission possible.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {sponsorsList.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <SponsorCard sponsor={sponsor} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
