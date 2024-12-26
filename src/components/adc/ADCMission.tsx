import { motion } from "framer-motion";

export const ADCMission = () => {
  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-secondary mb-4">Notre Mission</h2>
        <p className="text-gray-600">
          L'Atlas de Diagnostic Chirurgical est une ressource visuelle complète dédiée à l'avancement 
          de la pratique chirurgicale. Notre mission est de fournir une plateforme pour partager les 
          connaissances, les innovations et les meilleures pratiques dans le domaine du diagnostic chirurgical.
        </p>
      </motion.div>
    </div>
  );
};