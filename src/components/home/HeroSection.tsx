
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const images = [
  '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
  '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
  '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png'
];

const gradients = [
  'from-[#1E40AF] via-[#348d57] to-[#348d57]',
  'from-[#1E3A8A] via-[#2e7d4b] to-[#2e7d4b]',
  'from-[#0C4A6E] via-[#307045] to-[#307045]'
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

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
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[calc(80vh-4rem-30px)] pt-20 md:pt-28 z-0">
      {/* Base gradient background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#348d57] to-[#348d57] opacity-90 z-0"></div>
      
      {/* Surgical background image layer */}
      <div 
        className="absolute inset-0 z-1"
        style={{ 
          backgroundImage: `url('/lovable-uploads/8821672c-9173-4a9c-b526-9c7c11b0b158.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
          mixBlendMode: 'overlay'
        }}
      ></div>

      {/* Animated product image layer */}
      <AnimatePresence mode="wait">
        <div
          key={currentIndex}
          className="absolute inset-0 z-2"
        >
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${gradients[currentIndex]} opacity-70 z-0`}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-[75%] h-[calc(4/5*120%-30px)] md:h-[calc(3/4*120%-30px)] lg:h-[calc(2/3*120%-30px)] z-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              backgroundImage: `url(${images[currentIndex]})`,
              backgroundSize: 'contain',
              backgroundPosition: 'right bottom',
              backgroundRepeat: 'no-repeat',
              opacity: 0.9,
              right: '5%',  // Changed from -35% to 5%, moving it in the opposite direction
              paddingLeft: '5px'
            }}
          />
        </div>
      </AnimatePresence>
      
      {/* Content layer */}
      <div className="relative max-w-7xl mx-auto text-left z-10">
        <div className="max-w-xl lg:max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-up tracking-tight md:whitespace-nowrap whitespace-normal">
            Votre espace scientifique<br className="md:hidden" /> en ligne
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-8 animate-fade-up leading-relaxed">
            La plateforme de référence pour les professionnels de santé en Haïti
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="group bg-white hover:bg-white/90 text-[#122db0] font-medium"
              onClick={() => navigate('/submission')}
            >
              Soumettre votre article
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              className="bg-transparent hover:bg-white/10 text-white border-white border"
              onClick={() => navigate('/about')}
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
