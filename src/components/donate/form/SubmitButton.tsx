
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatedHeartBubbles } from "./AnimatedHeartBubbles";

interface SubmitButtonProps {
  isProcessing: boolean;
  selectedAmount: number;
  customAmount: string;
  handleInactiveButtonClick: () => void;
  handleSubmit: () => void;
  animationKey: number;
  isAnimating: boolean;
}

export const SubmitButton = ({
  isProcessing,
  selectedAmount,
  customAmount,
  handleInactiveButtonClick,
  handleSubmit,
  animationKey,
  isAnimating
}: SubmitButtonProps) => {
  return (
    <Button 
      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white relative overflow-hidden group" 
      disabled={(!selectedAmount && !customAmount) || isProcessing}
      onClick={(!selectedAmount && !customAmount) ? handleInactiveButtonClick : handleSubmit}
    >
      {isProcessing ? (
        <span className="flex items-center gap-2">
          <motion.div
            className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Processing...
        </span>
      ) : (
        <>
          <span className="relative z-10">Complete Donation</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}
      <AnimatedHeartBubbles animationKey={animationKey} isAnimating={isAnimating} />
    </Button>
  );
};
