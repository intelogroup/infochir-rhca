import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { Highlight } from "./carouselData";

interface CarouselCardProps {
  highlight: Highlight;
  index: number;
}

export const CarouselCard = ({ highlight, index }: CarouselCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-2 h-full"
    >
      <div className="relative group h-full rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={highlight.image}
            alt={highlight.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">
            {highlight.category}
          </Badge>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {highlight.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {highlight.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            {highlight.date && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {highlight.date}
              </span>
            )}
            {highlight.author && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {highlight.author}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};