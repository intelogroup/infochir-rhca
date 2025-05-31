
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";

interface PublicationTypeSelectorProps {
  form: UseFormReturn<ArticleFormData>;
}

export const PublicationTypeSelector = ({ form }: PublicationTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="publicationType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de publication</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de publication" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="RHCA">RHCA - Revue Haïtienne de Chirurgie et Anesthésiologie</SelectItem>
              <SelectItem value="IGM">IGM - Info Gazette Médicale</SelectItem>
              <SelectItem value="ADC">ADC - Atlas de Chirurgie</SelectItem>
              <SelectItem value="INDEX">Index Medicus</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
