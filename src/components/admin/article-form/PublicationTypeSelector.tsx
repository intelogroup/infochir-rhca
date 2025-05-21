
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UseFormReturn } from "react-hook-form";
import type { ArticleFormData } from "@/types/article";

interface PublicationTypeSelectorProps {
  form: UseFormReturn<ArticleFormData>;
}

export const PublicationTypeSelector = ({ form }: PublicationTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="publicationType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="font-medium">Type de publication</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              className="flex flex-col gap-3 sm:flex-row sm:gap-6 lg:gap-8"
            >
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="RHCA" />
                </FormControl>
                <FormLabel className="font-normal">
                  RHCA (Revue Haïtienne de Chirurgie et Anesthésiologie)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="IGM" />
                </FormControl>
                <FormLabel className="font-normal">
                  IGM (Info Gazette Médicale)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="ADC" />
                </FormControl>
                <FormLabel className="font-normal">
                  ADC (Atlas de Chirurgie)
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="INDEX" />
                </FormControl>
                <FormLabel className="font-normal">
                  INDEX (Index Medicus)
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
