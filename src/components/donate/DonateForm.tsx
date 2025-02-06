
import { useState, type ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import { DonationAmountSelector } from "./DonationAmountSelector";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { AmountDialog } from "./form/AmountDialog";
import { SubmitButton } from "./form/SubmitButton";

interface DonateFormProps {
  onAmountChange: (amount: number) => void;
  selectedAmount: number;
  customAmount: string;
  onCustomAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (paymentMethod: string) => Promise<void>;
  isProcessing: boolean;
}

export const DonateForm = ({
  onAmountChange,
  selectedAmount,
  customAmount,
  onCustomAmountChange,
  onSubmit,
  isProcessing
}: DonateFormProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [showAmountDialog, setShowAmountDialog] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const validateDonation = () => {
    if (!selectedAmount && !customAmount) {
      setShowAmountDialog(true);
      return false;
    }

    if (Number(customAmount) > 10000) {
      toast.error("Maximum donation amount is $10,000");
      return false;
    }

    return true;
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
    
    try {
      triggerAnimation();
      await onSubmit(selectedPaymentMethod);
    } catch (error: any) {
      toast.error(error.message || "Failed to process donation");
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
          <SubmitButton
            isProcessing={isProcessing}
            selectedAmount={selectedAmount}
            customAmount={customAmount}
            handleInactiveButtonClick={handleInactiveButtonClick}
            handleSubmit={handleSubmit}
            animationKey={animationKey}
            isAnimating={isAnimating}
          />
        </CardFooter>
      </Card>

      <AmountDialog 
        open={showAmountDialog} 
        onOpenChange={setShowAmountDialog}
      />
    </div>
  );
};
