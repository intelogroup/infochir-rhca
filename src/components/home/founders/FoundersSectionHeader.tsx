
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const FoundersSectionHeader = () => {
  return (
    <div className="text-center mb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <Star 
          className="w-8 h-8 text-[#1E40AF] animate-pulse" 
          aria-hidden="true"
        />
        <h2 className="type-h1 text-foreground">
          Membres Fondateurs
        </h2>
        <Star 
          className="w-8 h-8 text-[#1E40AF] animate-pulse" 
          aria-hidden="true"
        />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-gray-600 max-w-3xl mx-auto"
      >
        En 2011, ces médecins visionnaires se sont réunis pour créer Info CHIR, donnant naissance à une organisation dédiée à l'avancement de la chirurgie et de l'anesthésiologie en Haïti.
      </motion.p>
    </div>
  );
};
