
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentMethodSelectorProps {
  onSubmit: (amount: number) => void;
  isProcessing: boolean;
}

export const PaymentMethodSelector = ({
  onSubmit,
  isProcessing
}: PaymentMethodSelectorProps) => {
  const [amount, setAmount] = useState("");

  // Reset amount when component mounts
  useEffect(() => {
    setAmount("");
  }, []);

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0) {
      onSubmit(numericAmount);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="amount">Donation Amount (USD)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <DollarSign className="h-4 w-4 text-gray-500" />
          </span>
          <Input
            id="amount"
            type="number"
            min="1"
            step="1"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={isProcessing || !amount || parseFloat(amount) <= 0}
        className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white relative overflow-hidden group"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <>
            <DollarSign className="mr-2 h-4 w-4" />
            Donate Now
          </>
        )}
      </Button>
    </div>
  );
};
