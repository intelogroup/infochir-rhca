
import { useRef } from "react";
import { useCarouselData } from "./carousel/useCarouselData";
import { CarouselHeader } from "./carousel/CarouselHeader";
import { CarouselLoadingState } from "./carousel/CarouselLoadingState";
import { CarouselErrorState } from "./carousel/CarouselErrorState";
import { CarouselContentSection } from "./carousel/CarouselContent";
import { highlights } from "./carousel/carouselData";

export const CarouselSection = () => {
  const { data: carouselData, isLoading, error, refetch } = useCarouselData();
  const sectionRef = useRef(null);

  if (isLoading) {
    return <CarouselLoadingState />;
  }

  if (error) {
    return <CarouselErrorState error={error} onRetry={refetch} />;
  }

  const displayData = carouselData || highlights;

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-labelledby="carousel-section-title"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#41b06e] to-[#41b06e] opacity-5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="max-w-7xl mx-auto relative">
        <CarouselHeader />
        <CarouselContentSection data={displayData} sectionRef={sectionRef} />
      </div>
    </section>
  );
};
