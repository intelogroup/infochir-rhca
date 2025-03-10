
import { motion } from "framer-motion";

export const StatsDetails = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-10"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Nos chiffres clés
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        L'impact de notre travail en quelques statistiques
      </p>
    </motion.div>
  );
};
