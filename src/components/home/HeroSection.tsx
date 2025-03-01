
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
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[calc(100vh-4rem-40px)] pt-32 md:pt-40 z-0">
      <AnimatePresence mode="wait">
        <div
          key={currentIndex}
          className="absolute inset-0 z-0"
        >
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${gradients[currentIndex]} opacity-90 z-0`}
            style={{ height: 'calc(100% - 40px)' }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-1/2 h-[calc(4/5-30px)] md:h-[calc(3/4-30px)] lg:h-[calc(2/3-30px)] z-0"
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
              right: '10px',
              paddingLeft: '5px',
              height: 'calc(100% - 40px)'
            }}
          />
        </div>
      </AnimatePresence>
      
      <div className="relative max-w-7xl mx-auto text-left z-10" style={{ height: 'calc(100% - 40px)' }}>
        <div className="max-w-xl lg:max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 animate-fade-up tracking-tight md:whitespace-nowrap whitespace-normal">
            Votre espace scientifique<br className="md:hidden" /> en ligne
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 animate-fade-up leading-relaxed">
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
