
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, FileCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeclarationsFieldsProps {
  form: any;
  hasSubmissionAttempt?: boolean;
  hasError?: boolean;
}

export const DeclarationsFields = ({ form, hasSubmissionAttempt = false, hasError = false }: DeclarationsFieldsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      data-field="declarations"
    >
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" />
        Déclarations (optionnel)
      </h3>
      
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          Toute déclaration non cochée sera interprétée comme "non". Ces déclarations sont facultatives mais recommandées pour maintenir les standards éthiques et scientifiques.
        </p>
      </div>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="ethicsApproval"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  id="ethicsApproval"
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="ethicsApproval">
                  Approbation éthique
                </FormLabel>
                <FormDescription>
                  Cette recherche a reçu l'approbation éthique nécessaire
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="noConflict"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  id="noConflict"
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex items-center gap-2" htmlFor="noConflict">
                  <UserCheck className="h-4 w-4" />
                  Absence de conflit d'intérêt
                </FormLabel>
                <FormDescription>
                  Je déclare n'avoir aucun conflit d'intérêt
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="originalWork"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  id="originalWork"
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex items-center gap-2" htmlFor="originalWork">
                  <FileCheck className="h-4 w-4" />
                  Travail original
                </FormLabel>
                <FormDescription>
                  Je confirme que cet article est original et n'est pas en considération avec un autre journal
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};
