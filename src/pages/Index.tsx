import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;