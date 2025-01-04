import { motion, AnimatePresence } from "framer-motion";
import { StatsCard } from "@/components/ui/stats-card";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  details: string;
  iconClassName: string;
  index: number;
}

export const StatCard = ({ icon, title, value, details, iconClassName, index }: StatCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer group"
    >
      <AnimatePresence>
        <motion.div
          layout
          className="relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] to-white opacity-50" />
          <div className="relative p-4">
            <StatsCard
              icon={icon}
              title={title}
              value={value}
              iconClassName={iconClassName}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};