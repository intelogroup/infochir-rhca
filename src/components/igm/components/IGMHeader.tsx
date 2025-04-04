
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const IGMHeader = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* Gradient background with subtle animation */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent"
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
            className="gap-1.5 sm:gap-2 text-primary hover:text-primary-light transition-colors duration-200"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Retour
          </Button>
        </Link>

        <motion.div 
          style={{ y, opacity, scale }}
          className="space-y-8"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <motion.img 
              src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
              alt="IGM Logo"
              className="h-24 w-24 object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
          
          <div className="space-y-4">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Info Gazette Médicale
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Votre source d'information médicale de référence en Haïti.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
