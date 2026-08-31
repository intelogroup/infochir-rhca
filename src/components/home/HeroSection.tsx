
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Hero images with their optimized versions
const heroImages = [
  {
    src: '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png'
  },
  {
    src: '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png'
  },
  {
    src: '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png'
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

  const currentImageSrc = heroImages[currentIndex].src;

  return (
    <section 
      ref={sectionRef} 
      className="relative px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[520px] sm:min-h-[560px] lg:min-h-[620px] flex items-center pt-20 sm:pt-24 z-0 content-visibility-auto"
    >
      {/* Flat ink field — no gradients */}
      <div className="absolute inset-0 bg-secondary z-0" />

      <AnimatePresence mode="wait">
        <div
          key={currentIndex}
          className="absolute inset-0 z-1"
        >
          
          
          {/* Current hero image */}
          <motion.div 
            className="absolute bottom-0 right-0 hidden md:block w-[46%] h-[92%] z-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              backgroundImage: `url(${currentImageSrc})`,
              backgroundSize: 'contain',
              backgroundPosition: 'right bottom',
              backgroundRepeat: 'no-repeat',
              opacity: 0.85,
              right: '2%',
              willChange: 'opacity',
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
          />
        </div>
      </AnimatePresence>
      
      
      {/* Content section */}
      <div className="relative max-w-7xl mx-auto text-left z-10 pb-16 sm:pb-20">
        <div className="max-w-xl lg:max-w-3xl">
          <p className="type-eyebrow text-secondary-foreground/60 mb-4">Info Chir · Haïti</p>
          <div className="rule-gold mb-6" />
          <h1 className="type-display text-secondary-foreground mb-5 sm:mb-6 animate-fade-up">
            Votre espace scientifique<br className="hidden sm:block" /> en ligne
          </h1>
          <p className="type-lead text-secondary-foreground/75 max-w-xl mb-8 animate-fade-up">
            La plateforme de référence pour tous les professionnels de la santé, étudiants en médecine et le grand public.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary-light rounded-md"
              onClick={() => navigate('/submission')}
            >
              Soumettre votre article
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent text-secondary-foreground border-secondary-foreground/30 hover:bg-secondary-foreground/10 hover:text-secondary-foreground rounded-md"
              onClick={() => navigate('/about')}
            >
              Découvrir notre mission
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
