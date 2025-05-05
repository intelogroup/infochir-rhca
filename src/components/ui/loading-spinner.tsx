
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
  variant?: "default" | "medical" | "primary" | "secondary";
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

  const [dotCount, setDotCount] = useState(0);
  
  // Animated dots for loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const loadingDots = ".".repeat(dotCount);

  const renderLoader = () => {
    if (variant === "secondary") {
      return (
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-t-2 border-b-2 border-ocean/30 animate-[spin_2s_linear_infinite]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-r-2 border-l-2 border-secondary/30 animate-[spin_3s_linear_infinite_reverse]"></div>
          </div>
          <div className="animate-pulse bg-gradient-to-r from-ocean/20 via-secondary/20 to-primary/20 rounded-full p-3 absolute inset-0 flex items-center justify-center">
            <Sparkles className={cn(
              "text-secondary animate-[bounce_2s_ease-in-out_infinite]",
              size === "sm" ? "h-3 w-3" : size === "md" ? "h-5 w-5" : "h-7 w-7"
            )} />
          </div>
          <Loader2 
            className={cn(
              "animate-[spin_1.5s_linear_infinite] text-ocean relative z-10",
              sizeClasses[size],
              className
            )} 
          />
        </div>
      );
    }
    
    if (variant === "medical") {
      return (
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-t-2 border-b-2 border-primary/30 animate-[spin_2s_ease-out_infinite]"></div>
          </div>
          <div className="animate-pulse bg-gradient-to-r from-primary/10 via-ocean/10 to-primary/10 rounded-full p-3 absolute inset-0 flex items-center justify-center">
            <BookOpen className={cn(
              "text-primary/60 animate-[pulse_3s_ease-in-out_infinite]",
              size === "sm" ? "h-3 w-3" : size === "md" ? "h-5 w-5" : "h-7 w-7"
            )} />
          </div>
          <Loader2 
            className={cn(
              "animate-[spin_1.5s_ease-in-out_infinite] text-primary relative z-10",
              sizeClasses[size],
              className
            )} 
          />
        </div>
      );
    }
    
    if (variant === "primary") {
      return (
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-t-2 border-b-2 border-blue-300/50 animate-[spin_2s_ease-out_infinite]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-r-2 border-l-2 border-blue-500/50 animate-[spin_3s_ease-in-out_infinite_reverse]"></div>
          </div>
          <Loader2 
            className={cn(
              "animate-[spin_1s_linear_infinite] relative z-10 text-blue-600",
              sizeClasses[size],
              className
            )} 
          />
        </div>
      );
    }
    
    // Default variant with enhanced animation
    return (
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full rounded-full border-t-2 border-b-2 border-primary/30 animate-[spin_1.5s_ease-in-out_infinite]"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full rounded-full border-r-2 border-l-2 border-ocean/30 animate-[spin_2s_ease-in-out_infinite_reverse]"></div>
        </div>
        <Loader2 
          className={cn(
            "animate-[spin_1s_linear_infinite] relative z-10 text-primary",
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
          <p className="mt-4 text-primary font-medium text-sm animate-pulse">
            {text.replace(/\.+$/, '')}{loadingDots}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 mt-8">
      {renderLoader()}
      {text && (
        <p className="mt-3 text-primary/80 font-medium text-sm animate-pulse">
          {text.replace(/\.+$/, '')}{loadingDots}
        </p>
      )}
    </div>
  );
};
