
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface PaymentMethodSelectorProps {
  onSubmit: (amount: number) => void;
  isProcessing: boolean;
}

export const PaymentMethodSelector = ({
  onSubmit,
  isProcessing
}: PaymentMethodSelectorProps) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError("");
  };

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (!amount || numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (numericAmount > 10000) {
      setError("Maximum donation amount is $10,000");
      return;
    }
    onSubmit(numericAmount);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="amount">Donation Amount (USD)</Label>
        <div className="relative mt-1.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <DollarSign className="h-4 w-4 text-gray-500" />
          </span>
          <Input
            id="amount"
            type="number"
            min="1"
            max="10000"
            step="1"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className={`pl-10 h-12 text-lg ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={isProcessing || !amount || parseFloat(amount) <= 0}
        className="w-full h-12 text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white relative overflow-hidden group"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <>
            <DollarSign className="mr-2 h-5 w-5" />
            Donate Now
          </>
        )}
      </Button>
    </div>
  );
};
