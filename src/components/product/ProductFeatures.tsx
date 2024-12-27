import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductFeaturesProps {
  features: string[];
  className?: string;
}

export const ProductFeatures = ({ features, className }: ProductFeaturesProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {features.slice(0, 3).map((feature, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 text-gray-600 group"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary/80 transition-colors" />
          <span className="text-sm group-hover:text-gray-800 transition-colors">{feature}</span>
        </motion.div>
      ))}
    </div>
  );
};