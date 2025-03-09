
import { cn } from "@/lib/utils";

interface CarouselIndicatorsProps {
  items: any[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const CarouselIndicators = ({ 
  items, 
  currentIndex, 
  onSelect 
}: CarouselIndicatorsProps) => {
  return (
    <div className="flex justify-center gap-2 mt-4 md:hidden">
      {items.map((_, index) => (
        <button
          key={index}
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-300",
            currentIndex === index ? "bg-primary w-4" : "bg-primary/20"
          )}
          onClick={() => onSelect(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};
