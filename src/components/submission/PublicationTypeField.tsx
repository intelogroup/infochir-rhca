
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PublicationTypeFieldProps {
  form: any;
  hasSubmissionAttempt?: boolean;
  hasError?: boolean;
}

export const PublicationTypeField = ({ 
  form, 
  hasSubmissionAttempt = false, 
  hasError = false 
}: PublicationTypeFieldProps) => {
  return (
    <div data-field="publicationType">
      <FormField
        control={form.control}
        name="publicationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Type de publication *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger 
                  className={cn(
                    "w-full bg-white",
                    hasSubmissionAttempt && hasError && "border-destructive ring-destructive focus:ring-destructive"
                  )}
                >
                  <SelectValue placeholder="Sélectionnez un type de publication" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="RHCA">
                  <div className="flex flex-col">
                    <span className="font-medium">RHCA</span>
                    <span className="text-sm text-gray-600">Revue Haïtienne de Chirurgie et d'Anesthésiologie</span>
                  </div>
                </SelectItem>
                <SelectItem value="IGM">
                  <div className="flex flex-col">
                    <span className="font-medium">IGM</span>
                    <span className="text-sm text-gray-600">Info Gazette Médicale</span>
                  </div>
                </SelectItem>
                <SelectItem value="ATLAS">
                  <div className="flex flex-col">
                    <span className="font-medium">ATLAS</span>
                    <span className="text-sm text-gray-600">Atlas de Chirurgie</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
