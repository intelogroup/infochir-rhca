
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AbstractFieldProps {
  form: any;
  hasSubmissionAttempt?: boolean;
  hasError?: boolean;
}

export const AbstractField = ({ form, hasSubmissionAttempt = false, hasError = false }: AbstractFieldProps) => {
  // Helper function to count words in text
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };
  
  return (
    <FormField
      control={form.control}
      name="abstract"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2" htmlFor="abstract">
            <FileText className="h-4 w-4" />
            Résumé *
          </FormLabel>
          <FormControl>
            <Textarea 
              id="abstract" 
              name="abstract"
              placeholder="Entrez le résumé de votre article (max 3000 mots)" 
              className={cn(
                "min-h-[250px] bg-white/50 backdrop-blur-sm",
                hasSubmissionAttempt && (fieldState.error || hasError) && "border-destructive ring-destructive focus:ring-destructive"
              )}
              {...field}
            />
          </FormControl>
          <FormDescription className="flex justify-between">
            <span>Le résumé doit inclure le problème, la méthode, les résultats et la conclusion</span>
            <span className={countWords(field.value || '') > 3000 ? "text-destructive font-medium" : ""}>
              {countWords(field.value || '')} / 3000 mots
            </span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
