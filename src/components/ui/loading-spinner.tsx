
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  /**
   * The size of the loading spinner
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * The variant of the loading spinner
   */
  variant?: "default" | "primary" | "secondary" | "medical" | "fun";
  /**
   * Whether to display the loading spinner fullscreen
   */
  fullScreen?: boolean;
  /**
   * The text to display next to the loading spinner
   */
  text?: string;
  /**
   * The className to apply to the loading spinner container
   */
  className?: string;
}

/**
 * A loading spinner component that can be used to indicate loading state
 */
export const LoadingSpinner = ({
  size = "md",
  variant = "default",
  fullScreen = false,
  text,
  className,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const variantClasses = {
    default: "text-gray-500",
    primary: "text-ocean",
    secondary: "text-secondary",
    medical: "text-primary",
    fun: "text-pink-500", // Added fun variant with a pink color
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className={cn(
            "animate-spin",
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        {text && (
          <p
            className={cn(
              "font-medium animate-pulse",
              textSizeClasses[size],
              variantClasses[variant]
            )}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
};
