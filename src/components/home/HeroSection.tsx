import { useEffect, useState, useRef } from "react";
import { HeroContent } from "./hero/HeroContent";
import { HeroBackground } from "./hero/HeroBackground";

const images = [
  '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
  '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
  '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png'
];

const gradients = [
  'from-[#1E40AF] via-[#41b06e] to-[#41b06e]',
  'from-[#1E3A8A] via-[#4caf50] to-[#4caf50]',
  'from-[#0C4A6E] via-[#45a049] to-[#45a049]'
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  const startImageCycle = () => {
    if (cycleCount >= 3) return;
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % images.length;
        if (nextIndex === 0) {
          setCycleCount(count => count + 1);
        }
        return nextIndex;
      });
    }, 6000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setCycleCount(0);
          startImageCycle();
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (cycleCount >= 3 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [cycleCount]);
  
  return (
    <section ref={sectionRef} className="relative mt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <HeroBackground 
        currentIndex={currentIndex}
        images={images}
        gradients={gradients}
      />
      <HeroContent />
    </section>
  );
};