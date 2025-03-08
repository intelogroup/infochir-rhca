
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  show: boolean;
}

export const ScrollIndicator = ({ show }: ScrollIndicatorProps) => {
  // Optimized animation with smoother transitions and more reliable exit
  const indicatorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {show && (
        <motion.div
          variants={indicatorVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400 pointer-events-none"
        >
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
