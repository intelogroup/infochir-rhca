
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

let imagesPreloaded = false;

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
    }, 8000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (isVisible !== entry.isIntersecting) {
          setIsVisible(entry.isIntersecting);
          
          if (entry.isIntersecting) {
            setCycleCount(0);
            startImageCycle();
          } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      },
      { threshold: 0.3, rootMargin: '0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (cycleCount >= 3 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [cycleCount]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !imagesPreloaded) {
      imagesPreloaded = true;
      
      const timer = setTimeout(() => {
        images.forEach((src) => {
          const img = new Image();
          img.src = src;
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[calc(70vh-4rem)] sm:min-h-[calc(80vh-4rem-30px)] pt-16 sm:pt-20 md:pt-28 z-0 content-visibility-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#348d57] to-[#348d57] opacity-90 z-0"></div>
      
      <AnimatePresence mode="wait">
        <div
          key={currentIndex}
          className="absolute inset-0 z-1"
        >
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${gradients[currentIndex]} opacity-70 z-0`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-[85%] sm:w-[75%] h-[calc(4/5*120%-30px)] md:h-[calc(3/4*120%-30px)] lg:h-[calc(2/3*120%-30px)] z-2"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ 
              backgroundImage: `url(${images[currentIndex]})`,
              backgroundSize: 'contain',
              backgroundPosition: 'right bottom',
              backgroundRepeat: 'no-repeat',
              opacity: 0.9,
              right: '5%',
              paddingLeft: '5px',
              willChange: 'opacity, transform',
            }}
          />
        </div>
      </AnimatePresence>
      
      <div 
        className="absolute inset-0 z-3 pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
          opacity: 0.4,
          mixBlendMode: 'overlay'
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto text-left z-10">
        <motion.div 
          className="max-w-xl lg:max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight md:whitespace-nowrap whitespace-normal leading-tight">
            Votre espace scientifique<br className="md:hidden" /> en ligne
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-lg">
            La plateforme de référence pour les professionnels de santé en Haïti
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Button 
              size="default"
              variant="secondary" 
              className="group bg-white hover:bg-white/90 text-[#122db0] font-medium text-xs sm:text-sm md:text-base py-1.5 sm:py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/submission')}
            >
              Soumettre votre article
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </motion.span>
            </Button>
            <Button 
              size="default"
              className="bg-transparent hover:bg-white/10 text-white border-white border text-xs sm:text-sm md:text-base py-1.5 sm:py-2 transition-all duration-300"
              onClick={() => navigate('/about')}
            >
              En savoir plus
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
