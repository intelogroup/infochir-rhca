
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
    <div className="flex flex-col items-center mt-4 md:hidden">
      {/* Dot indicators */}
      <div 
        className="flex justify-center gap-1"
        role="tablist"
        aria-label="Carousel pagination"
      >
        {items.map((_, index) => (
          <button
            key={index}
            className={cn(
              "relative flex items-center justify-center p-3", // Added padding for larger hit area
              "touch-manipulation" // Better touch behavior
            )}
            onClick={() => onSelect(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={currentIndex === index}
            role="tab"
          >
            {/* Visual indicator inside larger tap target */}
            <span 
              className={cn(
                "h-2 rounded-full transition-all duration-300 absolute",
                currentIndex === index ? "bg-primary w-4" : "bg-primary/20 w-2"
              )} 
            />
          </button>
        ))}
      </div>
      
      {/* Pagination text indicator */}
      <div className="text-sm text-gray-600 mt-2" aria-live="polite">
        {currentIndex + 1} of {items.length}
      </div>
    </div>
  );
};
