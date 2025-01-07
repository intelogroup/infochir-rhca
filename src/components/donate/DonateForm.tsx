import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DonationAmountSelector } from "./DonationAmountSelector";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DonateFormProps {
  onAmountChange: (amount: number) => void;
  selectedAmount: number;
  customAmount: string;
  onCustomAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const DonateForm = ({
  onAmountChange,
  selectedAmount,
  customAmount,
  onCustomAmountChange
}: DonateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [showAmountDialog, setShowAmountDialog] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const heartBubbles = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const bubble = {
    hidden: { 
      opacity: 0,
      y: 0,
      scale: 0.5
    },
    visible: {
      opacity: [0, 1, 0],
      y: -30,
      scale: [0.5, 1.2, 0.5],
      transition: {
        duration: 0.8,
        repeat: 0,
      }
    }
  };

  const validateDonation = () => {
    if (!selectedAmount && !customAmount) {
      setShowAmountDialog(true);
      return false;
    }

    if (Number(customAmount) > 10000) {
      toast.error("Maximum donation amount is $10,000");
      return false;
    }

    if (selectedPaymentMethod === "card" && !validateCardFields()) {
      return false;
    }

    return true;
  };

  const validateCardFields = () => {
    const cardInputs = document.querySelectorAll('input');
    let isValid = true;
    cardInputs.forEach(input => {
      if (!input.value && input.placeholder !== "0") {
        toast.error(`Please enter ${input.placeholder}`);
        isValid = false;
      }
    });
    return isValid;
  };

  const triggerAnimation = () => {
    setAnimationKey(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 5000);
  };

  const handleSubmit = async () => {
    if (!validateDonation()) return;

    setIsSubmitting(true);
    triggerAnimation();
    try {
      // Placeholder for Stripe integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Thank you for your donation!");
    } catch (error) {
      toast.error("Failed to process donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInactiveButtonClick = () => {
    if (!selectedAmount && !customAmount) {
      setShowAmountDialog(true);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg backdrop-blur-sm bg-white/80 border-gray-100/20 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Choose Amount (USD)
            </span>
          </CardTitle>
          <CardDescription>Select a preset amount or enter a custom amount</CardDescription>
        </CardHeader>
        <CardContent>
          <DonationAmountSelector
            selectedAmount={selectedAmount}
            customAmount={customAmount}
            onAmountChange={onAmountChange}
            onCustomAmountChange={onCustomAmountChange}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg backdrop-blur-sm bg-white/80 border-gray-100/20 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Payment Method
          </CardTitle>
          <CardDescription>Choose your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentMethodSelector
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={setSelectedPaymentMethod}
          />
        </CardContent>
        <CardFooter className="relative">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white relative overflow-hidden group" 
            disabled={(!selectedAmount && !customAmount) || isSubmitting}
            onClick={(!selectedAmount && !customAmount) ? handleInactiveButtonClick : handleSubmit}
          >
            {isSubmitting ? (
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
          </Button>
          <motion.div
            key={animationKey}
            initial="hidden"
            animate={isAnimating ? "visible" : "hidden"}
            variants={heartBubbles}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full pointer-events-none"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d"
            }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                variants={bubble}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `translateZ(${Math.random() * 50}px)`
                }}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#ea384c] fill-[#ea384c]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="currentColor"
                  />
                </svg>
              </motion.div>
            ))}
          </motion.div>
        </CardFooter>
      </Card>

      <Dialog open={showAmountDialog} onOpenChange={setShowAmountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Donation Amount</DialogTitle>
            <DialogDescription>
              Please select a preset amount or enter a custom amount to proceed with your donation.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};