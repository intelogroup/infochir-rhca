
import React, { useRef, useEffect } from "react";
import { LazyMotion, domAnimation, motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const RHCAHeader = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  useEffect(() => {
    console.log("[RHCAHeader] Component mounted, scroll tracking initialized");
    return () => {
      console.log("[RHCAHeader] Component unmounted, cleaning up scroll tracking");
    };
  }, []);
  
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={ref} className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent animate-gradient"
          style={{
            backgroundSize: "200% 200%",
            animation: "gradient 15s ease infinite",
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Link to="/" className="inline-block mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 sm:gap-2 text-[#41b06e] hover:text-[#41b06e]/80 transition-colors duration-200"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              Retour
            </Button>
          </Link>

          <motion.div 
            style={{ y, opacity, scale }}
            className="space-y-8"
          >
            <div className="inline-flex items-center justify-center w-40 h-40 overflow-hidden">
              <motion.img 
                src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
                alt="RHCA Logo"
                className="h-40 w-40 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>
            
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl sm:text-5xl font-bold text-[#41b06e]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Revue Haïtienne de Chirurgie et d'Anesthésiologie
              </motion.h1>
              <motion.p 
                className="text-xl text-[#41b06e]/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                La référence en chirurgie et anesthésiologie en Haïti
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </LazyMotion>
  );
};
