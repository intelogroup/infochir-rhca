
import { motion } from "framer-motion";

export const CarouselHeader = () => {
  return (
    <div className="text-center mb-12">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="type-h1 text-foreground mb-4"
      >
        À la Une
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-gray-600 max-w-2xl mx-auto"
      >
        Découvrez les dernières publications de nos revues
      </motion.p>
    </div>
  );
};
