
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
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <BookOpen className={cn(
              "text-primary/40",
              sizeClasses[size],
              className
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
    );
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        {renderLoader()}
        {text && (
          <p className="mt-4 text-primary/80 font-medium text-sm">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {renderLoader()}
      {text && (
        <p className="mt-2 text-primary/80 font-medium text-sm">{text}</p>
      )}
    </div>
  );
};
