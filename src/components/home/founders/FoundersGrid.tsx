
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
  return (
    <>
      {isDeceased && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mt-8 mb-4 text-center">
          <h3 className="text-xl font-semibold text-gray-700">In Memoriam</h3>
        </div>
      )}
      <div className={`col-span-1 ${founders.length === 1 && isDeceased ? 'md:col-span-2 lg:col-span-3 xl:col-span-4' : ''} grid grid-cols-1 ${founders.length > 1 && isDeceased ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''} gap-8`}>
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
                logger.info(`${isDeceased ? 'Deceased f' : 'F'}ounder card clicked: ${founder.name}`);
                onSelectFounder(founder);
              }}
              memorialStyle={isDeceased}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
};
