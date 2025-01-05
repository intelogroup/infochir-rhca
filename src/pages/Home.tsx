import { MainLayout } from "@/components/layouts/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { CarouselSection } from "@/components/home/CarouselSection";
import { FoundersSection } from "@/components/home/FoundersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const Home = () => {
  return (
    <MainLayout>
      <HeroSection />
      <ProductsSection />
      <CarouselSection />
      <FoundersSection />
      <SponsorsSection />
      <StatsSection />
      <NewsletterSection />
    </MainLayout>
  );
};

export default Home;