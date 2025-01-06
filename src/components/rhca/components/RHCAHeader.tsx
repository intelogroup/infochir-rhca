import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const RHCAHeader = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
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
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg mb-6 overflow-hidden">
            <motion.img 
              src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
              alt="RHCA Logo"
              className="h-20 w-20 object-contain"
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
              Revue Haïtienne de Chirurgie et d'Anesthésiologie
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
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
  );
};