
import { useState, type ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import { DonationAmountSelector } from "./DonationAmountSelector";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { AmountDialog } from "./form/AmountDialog";

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
  const [showAmountDialog, setShowAmountDialog] = useState(false);

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

  const handleSubmit = async () => {
    if (!validateDonation()) return;
    
    try {
      await onSubmit('card');
    } catch (error: any) {
      toast.error(error.message || "Failed to process donation");
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
            Complete Donation
          </CardTitle>
          <CardDescription>You will be redirected to our secure payment provider</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentMethodSelector
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
          />
        </CardContent>
      </Card>

      <AmountDialog 
        open={showAmountDialog} 
        onOpenChange={setShowAmountDialog}
      />
    </div>
  );
};
