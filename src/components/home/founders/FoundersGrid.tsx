
import { motion } from "framer-motion";
import { Founder } from "@/hooks/useFounders";
import { FounderCard } from "./FounderCard";
import { createLogger } from "@/lib/error-logger";
import { useIsMobile } from "@/hooks/use-mobile";

const logger = createLogger('FoundersGrid');

interface FoundersGridProps {
  founders: Founder[];
  onSelectFounder: (founder: Founder) => void;
}

export const FoundersGrid = ({ 
  founders, 
  onSelectFounder
}: FoundersGridProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        "grid gap-4 sm:gap-6 md:gap-8", 
        isMobile 
          ? "grid-cols-2 max-w-md mx-auto" 
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      )}
      role="list"
      aria-label="Liste des membres fondateurs"
    >
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
  );
};

// Import missing cn utility
import { cn } from "@/lib/utils";
