
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface CarouselControlsProps {
  current: number;
  itemsCount: number;
  api: any;
}

export const CarouselControls = ({ current, itemsCount, api }: CarouselControlsProps) => {
  return (
    <>
      <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16 h-12 w-12 border-2 border-primary/20 bg-white/80 hover:bg-white">
        <ChevronLeft className="h-6 w-6 text-primary" />
      </CarouselPrevious>
      
      <CarouselNext className="hidden md:flex -right-12 lg:-right-16 h-12 w-12 border-2 border-primary/20 bg-white/80 hover:bg-white">
        <ChevronRight className="h-6 w-6 text-primary" />
      </CarouselNext>

      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {Array.from({ length: itemsCount }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              current === index ? "bg-primary w-4" : "bg-primary/20"
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};
