
import { StatsCard } from "@/components/ui/stats-card";
import { motion } from "framer-motion";
import { StatsCardProps } from "@/components/ui/stats-card";

interface StatsCardGridProps {
  statsData: StatsCardProps[];
}

export const StatsCardGrid: React.FC<StatsCardGridProps> = ({ statsData }) => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
      role="list"
      aria-label="Liste des statistiques"
    >
      {statsData.map((stat, index) => (
        <motion.div 
          key={index} 
          role="listitem" 
          className="transform transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};
