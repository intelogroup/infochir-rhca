
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

interface NotesFieldProps {
  form: any;
}

export const NotesField = ({ form }: NotesFieldProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Notes additionnelles
      </h3>
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes ou informations supplémentaires</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ajoutez ici toute information supplémentaire que vous souhaitez partager concernant votre soumission..."
                className="min-h-[120px] resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Ce champ est optionnel. Vous pouvez y ajouter des commentaires, des remerciements, ou toute autre information pertinente pour votre soumission.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};
