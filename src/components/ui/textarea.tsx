
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, name, error, helperText, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
    const uniqueId = React.useId();
    const textareaId = id || `textarea-${uniqueId}`;
    const helperTextId = `${textareaId}-helper-text`;
    
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          id={textareaId}
          name={name || textareaId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={helperText ? helperTextId : ariaDescribedBy}
          {...props}
        />
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
