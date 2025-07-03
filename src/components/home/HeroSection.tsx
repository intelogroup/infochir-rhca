
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Hero images with their optimized versions
const heroImages = [
  {
    src: '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
    gradient: 'from-[#1E40AF] via-[#348d57] to-[#348d57]'
  },
  {
    src: '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
    gradient: 'from-[#1E3A8A] via-[#2e7d4b] to-[#2e7d4b]'
  },
  {
    src: '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png',
    gradient: 'from-[#0C4A6E] via-[#307045] to-[#307045]'
  }
];

// Track preloaded state
let imagesPreloaded = false;
const preloadedImages = new Map();

// Preload hero images
const preloadHeroImages = () => {
  if (imagesPreloaded) return Promise.resolve(true);
  
  const preloadPromises = heroImages.map((img, index) => {
    return new Promise((resolve) => {
      // Skip if already preloaded
      if (preloadedImages.has(index)) {
        resolve(true);
        return;
      }
      
      const image = new Image();
      image.onload = () => {
        preloadedImages.set(index, image);
        resolve(true);
      };
      image.onerror = () => resolve(false);
      image.src = img.src;
      image.fetchPriority = index === 0 ? 'high' : 'low';
    });
  });
  
  return Promise.all(preloadPromises).then(() => {
    imagesPreloaded = true;
    return true;
  });
};

// Start preloading immediately
if (typeof window !== 'undefined') {
  preloadHeroImages();
}

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [areImagesLoaded, setAreImagesLoaded] = useState(imagesPreloaded);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Start image preloading as soon as component mounts
  useEffect(() => {
    if (!hasStartedLoading) {
      setHasStartedLoading(true);
      preloadHeroImages().then(() => {
        setAreImagesLoaded(true);
      });
    }
  }, [hasStartedLoading]);

  // Start image cycle only when in view and images are loaded
  const startImageCycle = () => {
    if (cycleCount >= 3 || !areImagesLoaded) return;
    
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % heroImages.length;
          if (nextIndex === 0) {
            setCycleCount(count => count + 1);
          }
          return nextIndex;
        });
      }, 8000); // Keep 8 second rotation
    }
  };

  // Control image cycle based on visibility and loaded state
  useEffect(() => {
    if (isVisible && areImagesLoaded) {
      startImageCycle();
    }
  }, [isVisible, areImagesLoaded]);

  // Intersection observer to detect when section is in viewport
  useEffect(() => {
    // Use a lower threshold to start loading earlier
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (isVisible !== entry.isIntersecting) {
          setIsVisible(entry.isIntersecting);
          
          if (entry.isIntersecting && areImagesLoaded) {
            setCycleCount(0);
            startImageCycle();
          } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      },
      { threshold: 0.1, rootMargin: '50px 0px' } // Lower threshold and bigger margin
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible, areImagesLoaded]);

  // Stop cycling after 3 complete cycles
  useEffect(() => {
    if (cycleCount >= 3 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [cycleCount]);

  const currentGradient = heroImages[currentIndex].gradient;
  const currentImageSrc = heroImages[currentIndex].src;

  return (
    <section 
      ref={sectionRef} 
      className="relative px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[calc(70vh-4rem)] sm:min-h-[calc(80vh-4rem-30px)] pt-16 sm:pt-20 md:pt-28 z-0 content-visibility-auto"
    >
      {/* Static background gradient that's always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#348d57] to-[#348d57] opacity-90 z-0"></div>
      
      {/* Animated gradient and image */}
      <AnimatePresence mode="wait">
        <div
          key={currentIndex}
          className="absolute inset-0 z-1"
        >
          {/* Current gradient background */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${currentGradient} opacity-70 z-0`}
          />
          
          {/* Current hero image */}
          <motion.div 
            className="absolute bottom-0 right-0 w-[85%] sm:w-[75%] h-[calc(4/5*120%-30px)] md:h-[calc(3/4*120%-30px)] lg:h-[calc(2/3*120%-30px)] z-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              backgroundImage: `url(${currentImageSrc})`,
              backgroundSize: 'contain',
              backgroundPosition: 'right bottom',
              backgroundRepeat: 'no-repeat',
              opacity: 0.9,
              right: '5%',
              willChange: 'opacity',
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
          />
        </div>
      </AnimatePresence>
      
      {/* Decorative grid overlay */}
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
      
      {/* Content section */}
      <div className="relative max-w-7xl mx-auto text-left z-10">
        <div className="max-w-xl lg:max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-up tracking-tight md:whitespace-nowrap whitespace-normal mt-2 sm:mt-0">
            Votre espace scientifique<br className="md:hidden" /> en ligne
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 animate-fade-up leading-relaxed">
            La plateforme de référence pour tous les professionnels de la santé, étudiants en médecine et le grand public.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Button 
              size="default"
              variant="secondary" 
              className="group bg-white hover:bg-white/90 text-[#122db0] font-medium text-xs sm:text-sm md:text-base py-1.5 sm:py-2"
              onClick={() => navigate('/submission')}
            >
              Soumettre votre article
            </Button>
            <Button 
              size="default"
              className="bg-transparent hover:bg-white/10 text-white border-white border text-xs sm:text-sm md:text-base py-1.5 sm:py-2"
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
