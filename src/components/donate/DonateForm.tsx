
import { useState, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
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
  onSubmit,
  isProcessing
}: DonateFormProps) => {
  const [showAmountDialog, setShowAmountDialog] = useState(false);

  const handleSubmit = async () => {
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
          <CardTitle className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Support Our Mission
          </CardTitle>
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
