
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export interface PublicationTypeSelectorProps {
  form: UseFormReturn<ArticleFormData>;
}

export const PublicationTypeSelector = ({ form }: PublicationTypeSelectorProps) => {
  // Set an error after mount if no type is selected
  useEffect(() => {
    if (!form.getValues().publicationType) {
      setTimeout(() => {
        form.setError("publicationType", {
          type: "required",
          message: "Veuillez sélectionner un type de publication"
        });
      }, 500);
    }
  }, []);

  return (
    <FormField
      control={form.control}
      name="publicationType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1.5" htmlFor="publication-type">
            Type de publication
            {form.formState.errors.publicationType && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            {field.value && !form.formState.errors.publicationType && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              (Requis)
            </span>
          </FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                form.clearErrors("publicationType");
              }} 
              defaultValue={field.value}
              onOpenChange={(open) => {
                if (!open && !field.value) {
                  form.setError("publicationType", {
                    type: "required",
                    message: "Veuillez sélectionner un type de publication"
                  });
                }
              }}
            >
              <SelectTrigger 
                id="publication-type"
                className={form.formState.errors.publicationType 
                  ? "border-red-300 focus:ring-red-500" 
                  : field.value 
                    ? "border-green-300 focus:ring-green-500"
                    : ""
                }
              >
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RHCA">RHCA</SelectItem>
                <SelectItem value="IGM">IGM</SelectItem>
                <SelectItem value="ADC">ADC</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
