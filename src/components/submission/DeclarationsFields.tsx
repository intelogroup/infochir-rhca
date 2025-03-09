import { FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, FileCheck } from "lucide-react";

export const DeclarationsFields = ({ form }: { form: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" />
        Déclarations
      </h3>
      
      <FormField
        control={form.control}
        name="ethicsApproval"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
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
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center gap-2">
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
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center gap-2">
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
    </motion.div>
  );
};