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
      className="cursor-pointer"
    >
      <AnimatePresence>
        <motion.div
          layout
          className={`bg-gradient-to-br from-white to-secondary/5 p-4 rounded-xl shadow-sm border border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-md ${
            isExpanded ? "md:col-span-2" : ""
          }`}
        >
          <StatsCard
            icon={icon}
            title={title}
            value={value}
            iconClassName={iconClassName}
          />
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 text-sm text-gray-600 overflow-hidden"
              >
                {details}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};