
import { BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
  variant?: "default" | "medical";
}

export const LoadingSpinner = ({ 
  size = "md", 
  className = "", 
  text = "Chargement...",
  fullScreen = false,
  variant = "default"
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const renderLoader = () => {
    if (variant === "medical") {
      return (
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-t-2 border-b-2 border-primary/30 animate-spin"></div>
          </div>
          <div className="animate-pulse bg-primary/10 rounded-full p-3 absolute inset-0 flex items-center justify-center">
            <BookOpen className={cn(
              "text-primary/60",
              size === "sm" ? "h-3 w-3" : size === "md" ? "h-5 w-5" : "h-7 w-7"
            )} />
          </div>
          <Loader2 
            className={cn(
              "animate-spin text-primary relative z-10",
              sizeClasses[size],
              className
            )} 
          />
        </div>
      );
    }
    
    return (
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full rounded-full border-t-2 border-b-2 border-primary/30 animate-spin"></div>
        </div>
        <Loader2 
          className={cn(
            "animate-spin text-primary relative z-10",
            sizeClasses[size],
            className
          )} 
        />
      </div>
    );
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        {renderLoader()}
        {text && (
          <p className="mt-4 text-primary font-medium text-sm animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {renderLoader()}
      {text && (
        <p className="mt-3 text-primary/80 font-medium text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
};
