
import { motion } from "framer-motion";
import { CarouselCard } from "./CarouselCard";
import { CarouselItem } from "./types";

interface CarouselItemContentProps {
  item: CarouselItem;
  index: number;
  onSelect: (item: CarouselItem, index: number) => void;
}

export const CarouselItemContent = ({ item, index, onSelect }: CarouselItemContentProps) => {
  return (
    <motion.div 
      className="h-full" 
      onClick={() => onSelect(item, index)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item, index);
        }
      }}
      aria-label={`View details of ${item.title}`}
    >
      <CarouselCard highlight={item} index={index} />
    </motion.div>
  );
};
