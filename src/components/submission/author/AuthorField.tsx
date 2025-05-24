
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthorFieldProps {
  form: any;
  name: string;
  label: string;
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  hasSubmissionAttempt?: boolean;
}

export const AuthorField = ({ 
  form, 
  name, 
  label, 
  icon: Icon, 
  type = "text", 
  placeholder,
  hasSubmissionAttempt = false
}: AuthorFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className={cn(
                "bg-white/50 backdrop-blur-sm",
                hasSubmissionAttempt && fieldState.error && "border-destructive ring-destructive focus:ring-destructive"
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
