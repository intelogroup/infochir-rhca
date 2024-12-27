import { motion } from "framer-motion";
import { BookText, Search } from "lucide-react";

export const ADCHeader = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-transparent" />
      <div className="relative text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-sm mb-6">
          <img 
            src="/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
            alt="Atlas ADC Logo"
            className="h-16 w-16 object-contain"
          />
        </div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-secondary mb-4"
        >
          Atlas de Diagnostic Chirurgical
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
        >
          Une ressource visuelle complète pour le diagnostic chirurgical.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-sm text-gray-600">
            <BookText className="h-4 w-4 text-secondary" />
            <span>Plus de 500 cas cliniques</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-sm text-gray-600">
            <Search className="h-4 w-4 text-secondary" />
            <span>Recherche avancée</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};