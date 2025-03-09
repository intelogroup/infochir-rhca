
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CarouselCard } from "@/components/home/carousel/CarouselCard";
import { CarouselControls } from "@/components/home/carousel/CarouselControls";

interface CarouselContentProps {
  data: any[];
}

export const CarouselContentSection = ({ data }: CarouselContentProps) => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      // Reset the autoplay timer when manually changing slides
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        if (autoPlay) {
          startAutoPlay();
        }
      }
    });
    
    return () => {
      api.off("select");
    };
  }, [api, autoPlay]);

  // Start/stop autoplay when in view
  useEffect(() => {
    if (isInView && api) {
      setAutoPlay(true);
      startAutoPlay();
    } else if (!isInView && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isInView, api]);

  const startAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, 5000) as unknown as number;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full">
      <Carousel
        opts={{ 
          align: "start", 
          loop: true,
        }}
        setApi={setApi}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent className="py-4">
          {data.map((highlight, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 h-[400px]">
              <div className="h-full">
                <CarouselCard highlight={highlight} index={index} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselControls 
          current={current} 
          itemsCount={data.length}
          api={api}
        />
      </Carousel>
    </div>
  );
};
