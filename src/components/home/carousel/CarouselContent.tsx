
import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem as CarouselItemUI, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { CarouselCard } from "./CarouselCard";
import { CarouselIndicators } from "./CarouselIndicators";
import { CarouselModal } from "./CarouselModal";
import { CarouselItem } from "./types";
import { useCarouselAutoplay } from "./useCarouselAutoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInView } from "framer-motion";

interface CarouselContentProps {
  data: CarouselItem[];
  sectionRef: React.RefObject<HTMLElement>;
}

export const CarouselContentSection = ({ data, sectionRef }: CarouselContentProps) => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const carouselRef = useRef<HTMLDivElement>(null);

  // Use the autoplay hook
  const { handleManualInteraction } = useCarouselAutoplay({
    enabled: autoPlay,
    api,
    isInView
  });

  // Update current slide index when the carousel changes
  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      handleManualInteraction();
    });
    
    return () => {
      api.off("select");
    };
  }, [api, handleManualInteraction]);

  // Select an item for the modal
  const handleItemSelect = (item: CarouselItem, index: number) => {
    setSelectedItem(item);
    setCurrent(index);
    setModalOpen(true);
    setAutoPlay(false); // Pause autoplay when modal is open
  };

  // Close the modal
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
    
    if (isInView) {
      setAutoPlay(true);
    }

    // Return focus to the carousel after modal closes
    setTimeout(() => {
      carouselRef.current?.focus();
    }, 10);
  };

  // Navigate to the next item in the modal
  const handleNext = useCallback(() => {
    if (!data) return;
    const nextIndex = (current + 1) % data.length;
    setCurrent(nextIndex);
    setSelectedItem(data[nextIndex]);
    api?.scrollTo(nextIndex);
  }, [api, current, data]);

  // Navigate to the previous item in the modal
  const handlePrevious = useCallback(() => {
    if (!data) return;
    const prevIndex = (current - 1 + data.length) % data.length;
    setCurrent(prevIndex);
    setSelectedItem(data[prevIndex]);
    api?.scrollTo(prevIndex);
  }, [api, current, data]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (modalOpen) return; // Don't handle keyboard events when modal is open
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handlePrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNext();
        break;
      case 'Home':
        e.preventDefault();
        api?.scrollTo(0);
        break;
      case 'End':
        e.preventDefault();
        api?.scrollTo(data.length - 1);
        break;
    }
  }, [api, data?.length, handleNext, handlePrevious, modalOpen]);

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
                <motion.div 
                  className="h-full" 
                  onClick={() => handleItemSelect(item, index)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemSelect(item, index);
                    }
                  }}
                  aria-label={`View details of ${item.title}`}
                >
                  <CarouselCard highlight={item} index={index} />
                </motion.div>
              </CarouselItemUI>
            ))}
          </CarouselContent>
          
          {/* Desktop pagination indicator */}
          <div className="hidden md:flex items-center justify-center mt-4 text-sm text-gray-600">
            <span>{current + 1} of {data.length}</span>
          </div>

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

        {/* Accessibility instructions for keyboard users */}
        <div className="sr-only">
          Use arrow keys to navigate between slides. Press Enter to view details.
        </div>

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
