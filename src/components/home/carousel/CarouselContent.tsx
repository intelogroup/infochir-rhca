
import { useRef, useState } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem as CarouselItemUI, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { CarouselIndicators } from "./CarouselIndicators";
import { CarouselModal } from "./CarouselModal";
import { CarouselItem } from "./types";
import { useCarouselAutoplay } from "./useCarouselAutoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInView } from "framer-motion";
import { useCarouselState } from "./hooks/useCarouselState";
import { CarouselItemContent } from "./CarouselItemContent";
import { CarouselInstructions } from "./CarouselInstructions";
import { CarouselPagination } from "./CarouselPagination";

interface CarouselContentProps {
  data: CarouselItem[];
  sectionRef: React.RefObject<HTMLElement>;
}

export const CarouselContentSection = ({ data, sectionRef }: CarouselContentProps) => {
  const [api, setApi] = useState<any>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const carouselRef = useRef<HTMLDivElement>(null);

  const { 
    current,
    autoPlay,
    modalOpen,
    selectedItem,
    handleItemSelect,
    handleModalClose,
    handleNext,
    handlePrevious,
    handleKeyDown
  } = useCarouselState({ 
    data, 
    api, 
    isInView 
  });

  // Use the autoplay hook
  const { handleManualInteraction } = useCarouselAutoplay({
    enabled: autoPlay,
    api,
    isInView,
  });

  // Update selected item when current changes
  const onApiSelect = () => {
    handleManualInteraction();
  };

  // Effect to set up api event listeners
  if (api) {
    api.on("select", onApiSelect);
  }

  return (
    <>
      <div 
        ref={carouselRef} 
        tabIndex={0} 
        onKeyDown={handleKeyDown}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-50 rounded-lg"
        aria-roledescription="carousel"
        aria-label="Articles carousel"
      >
        <Carousel
          opts={{ 
            align: "start", 
            loop: true,
          }}
          setApi={setApi}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="py-4">
            {data.map((item, index) => (
              <CarouselItemUI 
                key={index} 
                className="md:basis-1/2 lg:basis-1/3 h-[400px]"
                aria-label={`Slide ${index + 1} of ${data.length}: ${item.title}`}
                aria-roledescription="slide"
              >
                <CarouselItemContent 
                  item={item} 
                  index={index} 
                  onSelect={handleItemSelect} 
                />
              </CarouselItemUI>
            ))}
          </CarouselContent>
          
          <CarouselPagination current={current} total={data.length} />

          <CarouselPrevious 
            className="hidden md:flex -left-12 lg:-left-16 h-12 w-12 border-2 border-primary/20 bg-white/80 hover:bg-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </CarouselPrevious>
          <CarouselNext 
            className="hidden md:flex -right-12 lg:-right-16 h-12 w-12 border-2 border-primary/20 bg-white/80 hover:bg-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </CarouselNext>
        </Carousel>

        <CarouselInstructions />

        <CarouselIndicators 
          items={data} 
          currentIndex={current} 
          onSelect={(index) => api?.scrollTo(index)} 
        />
      </div>

      {/* Global modal for carousel items */}
      {selectedItem && (
        <CarouselModal
          item={selectedItem}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={data.length > 1}
          hasPrevious={data.length > 1}
        />
      )}
    </>
  );
};
