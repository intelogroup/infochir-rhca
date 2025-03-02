
import * as React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { CarouselSection } from "@/components/home/CarouselSection";
import { FoundersSection } from "@/components/home/FoundersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ProductsSection } from "@/components/home/ProductsSection";

const Home = () => {
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
