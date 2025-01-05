import { motion } from "framer-motion";
import { StatsCard } from "@/components/ui/stats-card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  index: number;
}

export const StatCard = ({ title, value, description, icon, iconClassName, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="cursor-pointer group"
  >
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
  </motion.div>
);