
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import * as React from "react";

export const AbstractField = ({ form }: { form: any }) => {
  // Calculate remaining words when the field value changes
  const abstractValue = form.watch("abstract") || "";
  const wordCount = abstractValue.trim() ? abstractValue.trim().split(/\s+/).length : 0;
  const maxWords = 250;
  const minWords = 50;
  const remainingWords = maxWords - wordCount;
  
  // Determine if we're approaching the limit
  const isApproachingLimit = wordCount > maxWords * 0.8 && wordCount <= maxWords;
  const isOverLimit = wordCount > maxWords;
  const isBelowMinimum = wordCount < minWords && wordCount > 0;

  return (
    <FormField
      control={form.control}
      name="abstract"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2" htmlFor={`abstract-${field.name}`}>
            <FileText className="h-4 w-4" />
            Résumé
          </FormLabel>
          <FormControl>
            <Textarea 
              id={`abstract-${field.name}`}
              placeholder="Entrez le résumé de votre article (entre 50 et 250 mots)" 
              className="min-h-[150px] bg-white/50 backdrop-blur-sm"
              error={isOverLimit || isBelowMinimum}
              helperText={isOverLimit 
                ? `Limite dépassée de ${wordCount - maxWords} mots` 
                : isBelowMinimum 
                  ? `Il manque ${minWords - wordCount} mots pour atteindre le minimum`
                  : null
              }
              aria-describedby={`abstract-description abstract-count`}
              {...field}
            />
          </FormControl>
          <div className="flex justify-between items-center mt-1">
            <FormDescription id="abstract-description">
              Le résumé doit inclure le problème, la méthode, les résultats et la conclusion
            </FormDescription>
            <span 
              id="abstract-count"
              className={`text-xs transition-colors ${
                isApproachingLimit 
                  ? "text-amber-500" 
                  : isOverLimit 
                    ? "text-destructive font-medium" 
                    : "text-muted-foreground"
              }`}
              aria-live="polite"
            >
              {wordCount} / {maxWords} mots
            </span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
