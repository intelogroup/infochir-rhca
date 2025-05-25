
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CarouselCard highlight={item} index={index} onSelect={onSelect} />
    </motion.div>
  );
};
