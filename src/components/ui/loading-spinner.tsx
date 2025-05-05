
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary" | "medical";
  text?: string;
  className?: string;
}

const variantStyles = {
  default: "text-gray-500",
  primary: "text-primary",
  secondary: "text-secondary",
  medical: "text-[#41b06e]",
};

const sizeStyles = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const textSizeStyles = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export const LoadingSpinner = ({
  size = "md",
  variant = "default",
  text,
  className,
}: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 
        className={cn(
          "animate-spin", 
          sizeStyles[size], 
          variantStyles[variant]
        )} 
      />
      {text && (
        <p className={cn("text-gray-500 font-medium", textSizeStyles[size])}>
          {text}
        </p>
      )}
    </div>
  );
};
