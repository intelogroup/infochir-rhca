import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  '/lovable-uploads/3686281a-0f1a-46e8-a03f-c56d49e3d791.png',
  '/lovable-uploads/c77fedf7-c404-409a-9be9-fcce29fade51.png',
  '/lovable-uploads/5196dc1b-4168-4231-bcea-509edcde49a5.png'
];

const gradients = [
  'from-primary to-secondary',
  'from-primary/90 to-secondary/90 via-blue-500/80',
  'from-secondary/90 to-primary/90 via-green-500/80'
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
    }, 6000); // Changed from 5000 to 6000 milliseconds
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
    <section ref={sectionRef} className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} // Changed from 1 to 0.5 seconds
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[currentIndex]} opacity-90 transition-opacity duration-500`} /> {/* Changed duration from 1000 to 500 */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500" // Changed duration from 1000 to 500
            style={{ backgroundImage: `url(${images[currentIndex]})`, opacity: 0.5 }}
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 animate-fade-up tracking-tight">
          Votre espace scientifique en ligne
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed">
          La plateforme de référence pour les professionnels de santé en Haïti
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary" className="group">
            Soumettre votre article
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            className="bg-transparent hover:bg-white/10 text-white border-white border"
          >
            En savoir plus
          </Button>
        </div>
      </div>
    </section>
  );
};