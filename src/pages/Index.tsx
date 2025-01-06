import { MainLayout } from "@/components/layouts/MainLayout";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components with proper loading states
const HeroSection = lazy(() => import("@/components/home/HeroSection").then(module => ({ default: module.HeroSection })));
const StatsSection = lazy(() => import("@/components/home/StatsSection").then(module => ({ default: module.StatsSection })));
const ProductsSection = lazy(() => import("@/components/home/ProductsSection").then(module => ({ default: module.ProductsSection })));
const CarouselSection = lazy(() => import("@/components/home/CarouselSection").then(module => ({ default: module.CarouselSection })));
const FoundersSection = lazy(() => import("@/components/home/FoundersSection").then(module => ({ default: module.FoundersSection })));
const NewsletterSection = lazy(() => import("@/components/home/NewsletterSection").then(module => ({ default: module.NewsletterSection })));
const SponsorsSection = lazy(() => import("@/components/home/SponsorsSection").then(module => ({ default: module.SponsorsSection })));

// Improved loading skeleton with proper animation and sizing
const SectionSkeleton = () => (
  <div className="w-full min-h-[400px] animate-pulse bg-gray-100/80 backdrop-blur-sm rounded-lg" />
);

const Index = () => (
  <MainLayout>
    {/* Hero section is not lazy loaded as it's above the fold */}
    <HeroSection />
    
    <Suspense fallback={<SectionSkeleton />}>
      <StatsSection />
    </Suspense>
    
    <Suspense fallback={<SectionSkeleton />}>
      <ProductsSection />
    </Suspense>
    
    <Suspense fallback={<SectionSkeleton />}>
      <CarouselSection />
    </Suspense>
    
    <Suspense fallback={<SectionSkeleton />}>
      <FoundersSection />
    </Suspense>
    
    <Suspense fallback={<SectionSkeleton />}>
      <NewsletterSection />
    </Suspense>
    
    <Suspense fallback={<SectionSkeleton />}>
      <SponsorsSection />
    </Suspense>
  </MainLayout>
);

export default Index;