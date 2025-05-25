
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CarouselItem } from "./types";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";
import { useState } from "react";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('CarouselCard');

interface CarouselCardProps {
  highlight: CarouselItem;
  index: number;
  onSelect?: (item: CarouselItem, index: number) => void;
}

export const CarouselCard = ({ highlight, index, onSelect }: CarouselCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-500";
    
    const categories: Record<string, string> = {
      "IGM": "bg-blue-500",
      "RHCA": "bg-green-500",
      "ADC": "bg-purple-500",
      "Événement": "bg-orange-500",
      "Formation": "bg-red-500"
    };
    
    return categories[category] || "bg-gray-500";
  };

  const handleImageError = () => {
    logger.error(`Image failed to load for highlight: ${highlight.title}, URL: ${highlight.image}`);
    setImageError(true);
  };

  const handleReadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(highlight, index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100 cursor-pointer"
    >
      <div className="h-[30%] relative overflow-hidden">
        {imageError ? (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
            <span className="text-sm text-gray-500">Image non disponible</span>
          </div>
        ) : (
          <ImageOptimizer
            src={highlight.image}
            alt={highlight.title}
            width={400}
            height={200}
            className="w-full h-full object-cover object-top"
            fallbackText={highlight.title}
            onError={handleImageError}
          />
        )}
        
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between z-10">
          {highlight.category && (
            <span className={cn("text-xs font-semibold px-2 py-1 rounded-full text-white", getCategoryColor(highlight.category))}>
              {highlight.category}
            </span>
          )}
          {highlight.date && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm">
              {highlight.date}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2 line-clamp-2 text-left">{highlight.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow text-left">
          {highlight.description}
        </p>
        
        <div className="mt-auto">
          {highlight.author && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2 text-left">
              Par {highlight.author}
            </p>
          )}
          
          <button 
            onClick={handleReadMore}
            className="text-primary font-medium text-sm inline-flex items-center hover:underline"
          >
            Lire la suite
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
