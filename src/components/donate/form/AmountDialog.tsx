
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AmountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AmountDialog = ({ open, onOpenChange }: AmountDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Donation Amount</DialogTitle>
          <DialogDescription>
            Please select a preset amount or enter a custom amount to proceed with your donation.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
