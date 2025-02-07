
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface PaymentMethodSelectorProps {
  onSubmit: () => void;
  isProcessing: boolean;
}

export const PaymentMethodSelector = ({
  onSubmit,
  isProcessing
}: PaymentMethodSelectorProps) => {
  return (
    <Button 
      onClick={onSubmit}
      disabled={isProcessing}
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
  );
};
