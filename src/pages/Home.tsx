import * as React from "react";
import { HeroSection } from "@/components/home/HeroSection";

const CarouselSection = React.lazy(() => import("@/components/home/CarouselSection").then(mod => ({ default: mod.CarouselSection })));
const FoundersSection = React.lazy(() => import("@/components/home/FoundersSection").then(mod => ({ default: mod.FoundersSection })));
const SponsorsSection = React.lazy(() => import("@/components/home/SponsorsSection").then(mod => ({ default: mod.SponsorsSection })));
const StatsSection = React.lazy(() => import("@/components/home/StatsSection").then(mod => ({ default: mod.StatsSection })));
const NewsletterSection = React.lazy(() => import("@/components/home/NewsletterSection").then(mod => ({ default: mod.NewsletterSection })));
const ProductsSection = React.lazy(() => import("@/components/home/ProductsSection").then(mod => ({ default: mod.ProductsSection })));

const SectionFallback = () => (
  <div className="w-full py-16 flex items-center justify-center">
    <div className="animate-pulse bg-gray-100 rounded-lg h-64 w-full max-w-3xl"></div>
  </div>
);

const Home = () => {
  return (
    <>
      <HeroSection />
      
      <React.Suspense fallback={<SectionFallback />}>
        <ProductsSection />
      </React.Suspense>
      
      <React.Suspense fallback={<SectionFallback />}>
        <CarouselSection />
      </React.Suspense>
      
      <React.Suspense fallback={<SectionFallback />}>
        <FoundersSection />
      </React.Suspense>
      
      <React.Suspense fallback={<SectionFallback />}>
        <SponsorsSection />
      </React.Suspense>
      
      <React.Suspense fallback={<SectionFallback />}>
        <StatsSection />
      </React.Suspense>
      
      <React.Suspense fallback={<SectionFallback />}>
        <NewsletterSection />
      </React.Suspense>
    </>
  );
};

export default Home;
