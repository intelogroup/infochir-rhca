
import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <motion.div
          className="w-16 h-16 border-4 border-primary rounded-full"
          style={{ borderTopColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="w-16 h-16 border-4 border-primary/30 rounded-full absolute inset-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>
      <motion.p
        className="absolute mt-24 text-primary/80 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Chargement...
      </motion.p>
    </div>
  );
};
