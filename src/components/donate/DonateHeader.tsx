import { motion } from "framer-motion";

export const DonateHeader = () => {
  return (
    <div className="text-center mb-12 space-y-6">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
      >
        Soutenez INFOCHIR/RHCA
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-gray-600 max-w-2xl mx-auto backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-gray-100/20 shadow-xl"
      >
        Votre don aide à maintenir et améliorer la qualité de la recherche médicale en Haïti. 
        Ensemble, nous pouvons faire progresser les soins de santé dans notre communauté.
      </motion.p>
    </div>
  );
};