
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { AlertCircle, Check } from "lucide-react";

const DonationAmounts = [10, 25, 50, 100, 250, 500];
const MAX_DONATION = 10000;
const MIN_DONATION = 1;

interface DonationAmountSelectorProps {
  selectedAmount: number;
  customAmount: string;
  onAmountChange: (amount: number) => void;
  onCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting?: boolean;
}

export const DonationAmountSelector = ({
  selectedAmount,
  customAmount,
  onAmountChange,
  onCustomAmountChange,
  isSubmitting = false,
}: DonationAmountSelectorProps) => {
  const [customError, setCustomError] = React.useState<string | null>(null);
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const customInputId = React.useId();
  const errorId = `${customInputId}-error`;
  const descriptionId = `${customInputId}-description`;
  const validationId = `${customInputId}-validation`;
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // First validate the input
    if (value === "") {
      setCustomError(null);
      setIsValid(false);
      onCustomAmountChange(e);
      return;
    }
    
    const numericValue = Number(value);
    
    if (isNaN(numericValue)) {
      setCustomError("Veuillez entrer un montant valide");
      setIsValid(false);
      onCustomAmountChange(e); 
      return;
    }
    
    if (numericValue < MIN_DONATION) {
      setCustomError(`Le montant minimum est de $${MIN_DONATION}`);
      setIsValid(false);
      onCustomAmountChange(e); // Still update the field to show the error state
      return;
    }
    
    if (numericValue > MAX_DONATION) {
      setCustomError(`Le montant maximum est de $${MAX_DONATION}`);
      setIsValid(false);
      onCustomAmountChange(e); // Still update the field to show the error state
      return;
    }
    
    // If we got here, the input is valid
    setCustomError(null);
    setIsValid(true);
    onCustomAmountChange(e);
  };

  return (
    <div className={isSubmitting ? "opacity-75 pointer-events-none transition-opacity duration-200" : ""}>
      <fieldset 
        role="radiogroup" 
        aria-label="Sélectionnez un montant pour votre don"
        disabled={isSubmitting}
      >
        <legend className="sr-only">Sélectionnez un montant de don</legend>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {DonationAmounts.map((amount) => (
            <motion.button
              key={amount}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              onClick={() => onAmountChange(amount)}
              className={`h-16 text-lg relative overflow-hidden rounded-lg border ${
                selectedAmount === amount 
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 hover:border-primary/50"
              } ${isSubmitting ? "cursor-not-allowed" : ""}`}
              type="button"
              aria-pressed={selectedAmount === amount}
              id={`amount-${amount}`}
              disabled={isSubmitting}
            >
              <span className="relative z-10">${amount}</span>
              <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 transition-opacity ${
                selectedAmount === amount ? "opacity-100" : "opacity-0"
              }`} />
              {selectedAmount === amount && (
                <motion.span 
                  className="absolute top-2 right-2 text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-4 w-4" />
                </motion.span>
              )}
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
            className={`pl-8 text-lg ${
              customError ? "border-destructive focus-visible:ring-destructive" : 
              isValid && customAmount ? "border-green-500 focus-visible:ring-green-500" : ""
            } ${isSubmitting ? "bg-gray-50" : ""}`}
            value={customAmount}
            onChange={handleCustomAmountChange}
            max={MAX_DONATION}
            min={MIN_DONATION}
            step="1"
            id={customInputId}
            name="customAmount"
            aria-invalid={customError ? "true" : undefined}
            aria-describedby={`${customError ? errorId : ""} ${isValid && customAmount ? validationId : ""} ${descriptionId}`}
            aria-label="Montant personnalisé en dollars"
            disabled={isSubmitting}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          
          {isValid && customAmount && !customError && (
            <span 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
              id={validationId}
              aria-label="Montant valide"
            >
              <Check className="h-4 w-4" />
            </span>
          )}
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
