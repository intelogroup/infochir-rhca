
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  show: boolean;
}

export const ScrollIndicator = ({ show }: ScrollIndicatorProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400"
        >
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
