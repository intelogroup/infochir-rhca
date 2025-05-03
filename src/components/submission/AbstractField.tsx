
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export const AbstractField = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="abstract"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2" htmlFor="abstract">
            <FileText className="h-4 w-4" />
            Résumé
          </FormLabel>
          <FormControl>
            <Textarea 
              id="abstract" // Added id attribute
              placeholder="Entrez le résumé de votre article (max 250 mots)" 
              className="min-h-[150px] bg-white/50 backdrop-blur-sm"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Le résumé doit inclure le problème, la méthode, les résultats et la conclusion
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
