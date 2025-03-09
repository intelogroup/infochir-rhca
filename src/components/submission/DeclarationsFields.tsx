
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export interface DeclarationsFieldsProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export const DeclarationsFields = ({ form, disabled }: DeclarationsFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <ShieldCheck className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Déclarations</h3>
      </div>
      
      <div className={`p-3 bg-amber-50 border border-amber-200 rounded-md ${disabled ? "opacity-70" : ""}`}>
        <div className="flex gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Veuillez lire attentivement et cocher les déclarations suivantes. 
            Ces déclarations sont nécessaires pour la soumission de votre article.
          </p>
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="ethicsApproval"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Approbation éthique
              </FormLabel>
              <FormDescription>
                Je confirme que cette recherche a reçu l'approbation éthique appropriée des institutions concernées.
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
                disabled={disabled}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Absence de conflit d'intérêts
              </FormLabel>
              <FormDescription>
                Je déclare qu'il n'y a pas de conflit d'intérêts en lien avec cette soumission.
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
                disabled={disabled}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Travail original
              </FormLabel>
              <FormDescription>
                Je certifie que ce travail est original et n'a pas été publié ailleurs ni soumis simultanément à d'autres revues.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
