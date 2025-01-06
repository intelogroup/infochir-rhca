import { motion } from "framer-motion";
import { BookText, Search, Users } from "lucide-react";

export const ADCHeader = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
              alt="Atlas ADC Logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-secondary">
              Atlas de Diagnostic Chirurgical
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une ressource visuelle complète pour le diagnostic chirurgical, conçue pour les professionnels de santé.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md text-gray-600"
            >
              <BookText className="h-5 w-5 text-secondary" />
              <span>Plus de 500 cas cliniques</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md text-gray-600"
            >
              <Users className="h-5 w-5 text-secondary" />
              <span>Collaboration internationale</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md text-gray-600"
            >
              <Search className="h-5 w-5 text-secondary" />
              <span>Recherche avancée</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};