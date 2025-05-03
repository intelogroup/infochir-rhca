
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface AuthorFieldProps {
  form: any;
  name: string;
  label: string;
  icon: LucideIcon;
  type?: string;
  id?: string;
  placeholder?: string;
}

export const AuthorField = ({ 
  form, 
  name, 
  label, 
  icon: Icon,
  type = "text",
  id,
  placeholder
}: AuthorFieldProps) => {
  const fieldId = id || `author-${name.split('.').pop()}`;
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2" htmlFor={fieldId}>
            <Icon className="h-4 w-4" />
            {label}
          </FormLabel>
          <FormControl>
            <Input 
              id={fieldId}
              type={type}
              placeholder={placeholder}
              {...field} 
              className="bg-white/50 backdrop-blur-sm" 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
