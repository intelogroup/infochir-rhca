import { MainLayout } from "@/components/layouts/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CarouselSection } from "@/components/home/CarouselSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <CarouselSection />
      <NewsletterSection />
      <SponsorsSection />
    </MainLayout>
  );
};

export default Index;