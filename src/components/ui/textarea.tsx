
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
  isLoading?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, name, error, helperText, isLoading, disabled, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
    const uniqueId = React.useId();
    const textareaId = id || `textarea-${uniqueId}`;
    const helperTextId = `${textareaId}-helper-text`;
    
    // Combine disabled state from both isLoading and disabled prop
    const isDisabled = isLoading || disabled;
    
    return (
      <div className="w-full">
        <div className="relative">
          <textarea
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
              error && "border-destructive focus-visible:ring-destructive",
              isLoading && "bg-gray-50",
              className
            )}
            ref={ref}
            id={textareaId}
            name={name || textareaId}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={helperText ? helperTextId : ariaDescribedBy}
            disabled={isDisabled}
            {...props}
          />
          {isLoading && (
            <div className="absolute right-3 top-3 animate-pulse">
              <div className="h-2 w-4 bg-gray-200 rounded-full"></div>
            </div>
          )}
        </div>
        {helperText && (
          <p 
            id={helperTextId}
            className={cn(
              "text-sm mt-1", 
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
