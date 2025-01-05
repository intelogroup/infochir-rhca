import { MainLayout } from "@/components/layouts/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CarouselSection } from "@/components/home/CarouselSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { FoundersSection } from "@/components/home/FoundersSection";

const Index = () => (
  <MainLayout>
    <HeroSection />
    <StatsSection />
    <ProductsSection />
    <CarouselSection />
    <FoundersSection />
    <NewsletterSection />
    <SponsorsSection />
  </MainLayout>
);

export default Index;