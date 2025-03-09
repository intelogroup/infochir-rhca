
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const DonationAmounts = [10, 25, 50, 100, 250, 500];
const MAX_DONATION = 10000;

interface DonationAmountSelectorProps {
  selectedAmount: number;
  customAmount: string;
  onAmountChange: (amount: number) => void;
  onCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DonationAmountSelector = ({
  selectedAmount,
  customAmount,
  onAmountChange,
  onCustomAmountChange,
}: DonationAmountSelectorProps) => {
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= MAX_DONATION)) {
      onCustomAmountChange(e);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {DonationAmounts.map((amount) => (
          <motion.button
            key={amount}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAmountChange(amount)}
            className={`h-16 text-lg relative overflow-hidden rounded-lg border ${
              selectedAmount === amount 
                ? "border-primary bg-primary text-white"
                : "border-gray-200 hover:border-primary/50"
            }`}
            aria-label={`Donate $${amount}`}
          >
            <span className="relative z-10">${amount}</span>
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 transition-opacity ${
              selectedAmount === amount ? "opacity-100" : "opacity-0"
            }`} />
          </motion.button>
        ))}
      </div>
      <div className="space-y-2">
        <label htmlFor="custom-amount" className="text-sm font-medium">Or enter a custom amount</label>
        <div className="relative">
          <Input
            id="custom-amount"
            name="custom-amount"
            type="number"
            placeholder="0"
            className="pl-8 text-lg"
            value={customAmount}
            onChange={handleCustomAmountChange}
            max={MAX_DONATION}
            min={0}
            autoComplete="transaction-amount"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
        </div>
        {Number(customAmount) > MAX_DONATION && (
          <p className="text-sm text-red-500">Maximum donation amount is ${MAX_DONATION}</p>
        )}
      </div>
    </div>
  );
};
