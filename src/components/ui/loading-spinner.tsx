
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ 
  size = "md", 
  className = "", 
  text = "Chargement...",
  fullScreen = false
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-t-2 border-b-2 border-primary/30"></div>
          </div>
          <Loader2 
            className={cn(
              "animate-spin text-primary relative z-10",
              sizeClasses[size],
              className
            )} 
          />
        </div>
        {text && (
          <p className="mt-4 text-primary/80 font-medium text-sm">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full rounded-full border-t-2 border-b-2 border-primary/20"></div>
        </div>
        <Loader2
          className={cn(
            "animate-spin text-primary relative z-10",
            sizeClasses[size],
            className
          )}
        />
      </div>
      {text && (
        <p className="mt-2 text-primary/80 font-medium text-sm">{text}</p>
      )}
    </div>
  );
};
