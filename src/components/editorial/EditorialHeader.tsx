
import { motion } from "framer-motion";

export const EditorialHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center space-y-4 mb-16"
  >
    <h1 className="text-4xl md:text-5xl font-bold text-primary">
      Comité Éditorial
    </h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Notre comité éditorial est composé d'experts dévoués à la publication 
      d'articles de haute qualité dans le domaine de la chirurgie.
    </p>
  </motion.div>
);
