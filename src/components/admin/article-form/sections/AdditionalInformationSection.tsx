
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { Info } from "lucide-react";

interface AdditionalInformationSectionProps {
  form: UseFormReturn<ArticleFormData>;
}

export const AdditionalInformationSection = ({ form }: AdditionalInformationSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Info className="h-5 w-5" />
        Informations supplémentaires
      </h3>
      
      <FormField
        control={form.control}
        name="fundingSource"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source de financement</FormLabel>
            <FormControl>
              <Input
                placeholder="Source de financement de la recherche..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="doi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>DOI</FormLabel>
            <FormControl>
              <Input
                placeholder="10.1000/182"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Digital Object Identifier (optionnel)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
