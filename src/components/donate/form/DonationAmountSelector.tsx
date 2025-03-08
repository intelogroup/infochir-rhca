
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { AlertCircle } from "lucide-react";

const DonationAmounts = [10, 25, 50, 100, 250, 500];
const MAX_DONATION = 10000;
const MIN_DONATION = 1;

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
  const [customError, setCustomError] = React.useState<string | null>(null);
  const customInputId = React.useId();
  const errorId = `${customInputId}-error`;
  const descriptionId = `${customInputId}-description`;
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // First validate the input
    if (value === "") {
      setCustomError(null);
      onCustomAmountChange(e);
      return;
    }
    
    const numericValue = Number(value);
    
    if (isNaN(numericValue)) {
      setCustomError("Veuillez entrer un montant valide");
      return;
    }
    
    if (numericValue < MIN_DONATION) {
      setCustomError(`Le montant minimum est de $${MIN_DONATION}`);
      onCustomAmountChange(e); // Still update the field to show the error state
      return;
    }
    
    if (numericValue > MAX_DONATION) {
      setCustomError(`Le montant maximum est de $${MAX_DONATION}`);
      onCustomAmountChange(e); // Still update the field to show the error state
      return;
    }
    
    // If we got here, the input is valid
    setCustomError(null);
    onCustomAmountChange(e);
  };

  return (
    <div>
      <fieldset role="radiogroup" aria-label="Sélectionnez un montant pour votre don">
        <legend className="sr-only">Sélectionnez un montant de don</legend>
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
              type="button"
              aria-pressed={selectedAmount === amount}
              id={`amount-${amount}`}
            >
              <span className="relative z-10">${amount}</span>
              <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 transition-opacity ${
                selectedAmount === amount ? "opacity-100" : "opacity-0"
              }`} />
            </motion.button>
          ))}
        </div>
      </fieldset>
      
      <div className="space-y-2">
        <label 
          htmlFor={customInputId} 
          className="text-sm font-medium"
        >
          Ou entrez un montant personnalisé
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            className={`pl-8 text-lg ${customError ? "border-destructive focus-visible:ring-destructive" : ""}`}
            value={customAmount}
            onChange={handleCustomAmountChange}
            max={MAX_DONATION}
            min={MIN_DONATION}
            step="1"
            id={customInputId}
            name="customAmount"
            aria-invalid={customError ? "true" : undefined}
            aria-describedby={`${customError ? errorId : ""} ${descriptionId}`}
            aria-label="Montant personnalisé en dollars"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
        </div>
        
        {customError && (
          <div 
            className="flex items-center gap-1 text-sm text-destructive mt-1" 
            id={errorId}
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{customError}</span>
          </div>
        )}
        
        <p id={descriptionId} className="text-xs text-muted-foreground">
          Montant minimum: ${MIN_DONATION}, maximum: ${MAX_DONATION}
        </p>
      </div>
    </div>
  );
};
