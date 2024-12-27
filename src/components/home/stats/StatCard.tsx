import { motion } from "framer-motion";
import { StatsCard } from "@/components/ui/stats-card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  iconClassName: string;
  index: number;
}

export const StatCard = ({ icon, title, value, iconClassName, index }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-to-br from-white to-secondary/5 p-4 rounded-xl shadow-sm border border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-md"
    >
      <StatsCard
        icon={icon}
        title={title}
        value={value}
        iconClassName={iconClassName}
      />
    </motion.div>
  );
};