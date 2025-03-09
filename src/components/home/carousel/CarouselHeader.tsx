
import { motion } from "framer-motion";

export const CarouselHeader = () => {
  return (
    <div className="text-center mb-12">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold bg-gradient-to-r from-[#1E40AF] via-[#41b06e] to-[#41b06e] bg-clip-text text-transparent mb-4"
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
