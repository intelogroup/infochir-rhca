
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { DonorInformation } from "./DonorInformation";
import { DonationSummary } from "./DonationSummary";

interface DonateFormProps {
  onSubmit: (paymentMethod: string, donorInfo: {
    name: string;
    email: string;
    isAnonymous: boolean;
    message: string;
  }, amount: number) => Promise<void>;
  isProcessing: boolean;
}

export const DonateForm = ({
  onSubmit,
  isProcessing
}: DonateFormProps) => {
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState<number | null>(null);

  const handleSubmit = async (selectedAmount: number) => {
    try {
      if (!donorEmail) {
        toast.error("Please provide your email address");
        return;
      }

      if (!selectedAmount || selectedAmount <= 0) {
        toast.error("Please select a valid donation amount");
        return;
      }

      setAmount(selectedAmount);
      await onSubmit('card', {
        name: donorName,
        email: donorEmail,
        isAnonymous,
        message
      }, selectedAmount);
    } catch (error: any) {
      console.error('[DonateForm] Payment error:', error);
      toast.error(error.message || "Failed to process donation");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-lg backdrop-blur-sm bg-white/80 border-gray-100/20 hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Support Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DonorInformation
              donorName={donorName}
              donorEmail={donorEmail}
              isAnonymous={isAnonymous}
              message={message}
              onNameChange={setDonorName}
              onEmailChange={setDonorEmail}
              onAnonymousChange={setIsAnonymous}
              onMessageChange={setMessage}
            />
            
            <PaymentMethodSelector
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
            />
          </CardContent>
        </Card>
      </div>
      
      {amount && amount > 0 && (
        <div className="md:col-span-1">
          <DonationSummary amount={amount} />
        </div>
      )}
    </div>
  );
};
