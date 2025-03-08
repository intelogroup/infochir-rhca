
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface DonationButtonProps {
  isProcessing: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const DonationButton = ({ 
  isProcessing, 
  disabled, 
  onClick 
}: DonationButtonProps) => {
  return (
    <motion.div 
      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
    >
      <Button
        onClick={onClick}
        disabled={isProcessing || disabled}
        className="w-full h-14 text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white relative overflow-hidden group"
        aria-live="polite"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Continue to Payment
            <Heart className="h-4 w-4" />
          </span>
        )}
      </Button>
    </motion.div>
  );
};
