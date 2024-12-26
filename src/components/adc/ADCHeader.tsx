import { motion } from "framer-motion";

export const ADCHeader = () => {
  return (
    <div className="text-center mb-12 animate-fade-up">
      <img 
        src="/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
        alt="Atlas ADC Logo"
        className="h-32 w-32 mx-auto mb-6 object-contain" // Increased from h-24 w-24
      />
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
        className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
      >
        Une ressource visuelle complète pour le diagnostic chirurgical.
      </motion.p>
    </div>
  );
};