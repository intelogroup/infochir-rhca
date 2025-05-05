
import * as React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection"; 
import { CarouselSection } from "@/components/home/CarouselSection";
import { FoundersSection } from "@/components/home/FoundersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection"; 
import { StatsSection } from "@/components/home/StatsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

// Remove Suspense and lazy loading for homepage components as they're critical
const Home = () => {
  // Signal that the app has loaded completely to clear timeout in main.tsx
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('app-loaded'));
    }
  }, []);

  return (
    <>
      <HeroSection />
      <ProductsSection />
      <CarouselSection />
      <FoundersSection />
      <SponsorsSection />
      <StatsSection />
      <NewsletterSection />
    </>
  );
};

export default Home;
