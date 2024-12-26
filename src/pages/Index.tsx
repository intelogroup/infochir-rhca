import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        <HeroSection />
        <StatsSection />
        <ProductsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;