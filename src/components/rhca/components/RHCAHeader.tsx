
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const RHCAHeader = () => {
  return (
    <div className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center justify-center w-40 h-40 overflow-hidden">
            <img 
              src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
              alt="RHCA Logo"
              className="h-40 w-40 object-contain"
            />
          </div>
          
          <div className="space-y-4">
            <h1 
              className="text-4xl sm:text-5xl font-bold text-[#41b06e]"
            >
              Revue Haïtienne de Chirurgie et d'Anesthésiologie
            </h1>
            <p 
              className="text-xl text-[#41b06e]/80"
            >
              La référence en chirurgie et anesthésiologie en Haïti
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
