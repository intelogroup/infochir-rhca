
import { motion } from "framer-motion";
import { Founder } from "@/hooks/useFounders";
import { FounderCard } from "./FounderCard";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('FoundersGrid');

interface FoundersGridProps {
  founders: Founder[];
  onSelectFounder: (founder: Founder) => void;
  isDeceased?: boolean;
}

export const FoundersGrid = ({ 
  founders, 
  onSelectFounder, 
  isDeceased = false 
}: FoundersGridProps) => {
  // Log grid rendering for debugging
  logger.debug(`Rendering grid with ${founders.length} ${isDeceased ? 'deceased' : 'active'} founders`);
  
  return (
    <>
      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {founders.map((founder, index) => (
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
                onSelectFounder(founder);
              }}
              memorialStyle={false}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
};
