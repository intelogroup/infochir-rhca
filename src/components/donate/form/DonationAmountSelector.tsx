import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      <div className="mb-6 grid grid-cols-3 gap-3">
        {DonationAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onAmountChange(amount)}
            className={cn(
              "h-14 rounded-md border text-base transition-colors",
              selectedAmount === amount
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary/50"
            )}
            aria-label={`Faire un don de ${amount} $`}
          >
            {amount} $
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <label htmlFor="custom-amount" className="text-sm font-medium">
          Ou saisir un autre montant
        </label>
        <div className="relative">
          <Input
            id="custom-amount"
            name="custom-amount"
            type="number"
            placeholder="0"
            className="pl-8 text-base"
            value={customAmount}
            onChange={handleCustomAmountChange}
            max={MAX_DONATION}
            min={0}
            autoComplete="transaction-amount"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
        </div>
        {Number(customAmount) > MAX_DONATION && (
          <p className="text-sm text-destructive">
            Le montant maximum est de {MAX_DONATION} $
          </p>
        )}
      </div>
    </div>
  );
};
