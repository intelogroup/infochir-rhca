import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CarouselSection } from "@/components/home/CarouselSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <ProductsSection />
        <CarouselSection />
        <SponsorsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;