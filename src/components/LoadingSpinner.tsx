import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className = "" }: LoadingSpinnerProps) => {
  return (
    <Loader2 className={`h-4 w-4 animate-spin text-primary ${className}`} />
  );
};