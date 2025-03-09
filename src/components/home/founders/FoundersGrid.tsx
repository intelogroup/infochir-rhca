
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
  
  // Arrange founders into rows of 4
  const firstRowFounders = founders.slice(0, 4);
  const remainingFounders = founders.slice(4);
  
  return (
    <>
      {isDeceased && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mt-8 mb-4 text-center">
          <h3 className="text-xl font-semibold text-gray-700">In Memoriam</h3>
        </div>
      )}
      
      {/* First row - always display up to 4 founders */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {firstRowFounders.map((founder, index) => (
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
                logger.info(`${isDeceased ? 'Deceased f' : 'F'}ounder card clicked: ${founder.name}`);
                onSelectFounder(founder);
              }}
              memorialStyle={isDeceased}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Second row - remaining founders if any */}
      {remainingFounders.length > 0 && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {remainingFounders.map((founder, index) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 4) * 0.1 }}
              viewport={{ once: true }}
              role="listitem"
            >
              <FounderCard 
                founder={founder}
                onClick={() => {
                  logger.info(`${isDeceased ? 'Deceased f' : 'F'}ounder card clicked: ${founder.name}`);
                  onSelectFounder(founder);
                }}
                memorialStyle={isDeceased}
              />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};
