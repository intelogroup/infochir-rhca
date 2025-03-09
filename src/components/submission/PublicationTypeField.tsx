
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FileText } from "lucide-react";

export interface PublicationTypeFieldProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export const PublicationTypeField = ({ form, disabled }: PublicationTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="publicationType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Type de publication
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              className="flex flex-col gap-3"
              disabled={disabled}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="RHCA" id="publication-rhca" disabled={disabled} />
                <label htmlFor="publication-rhca" className={`font-medium ${disabled ? 'opacity-60' : ''}`}>
                  Revue d'histoire de la chirurgie africaine (RHCA)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="IGM" id="publication-igm" disabled={disabled} />
                <label htmlFor="publication-igm" className={`font-medium ${disabled ? 'opacity-60' : ''}`}>
                  InfoChir / Gazette médicale (IGM)
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
