import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DonationAmountSelector } from "./DonationAmountSelector";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

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

  const validateDonation = () => {
    if (!selectedAmount && !customAmount) {
      toast.error("Please select or enter a donation amount");
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

  const handleSubmit = async () => {
    if (!validateDonation()) return;

    setIsSubmitting(true);
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
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white relative overflow-hidden group" 
            disabled={(!selectedAmount && !customAmount) || isSubmitting}
            onClick={handleSubmit}
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
        </CardFooter>
      </Card>
    </div>
  );
};