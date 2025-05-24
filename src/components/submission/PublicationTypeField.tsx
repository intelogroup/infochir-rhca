
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const PublicationTypeField = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="publicationType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">Type de publication</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un type de publication" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="RHCA">
                <div className="flex flex-col">
                  <span className="font-medium">RHCA</span>
                  <span className="text-sm text-muted-foreground">Revue Haïtienne de Chirurgie et d'Anesthésiologie</span>
                </div>
              </SelectItem>
              <SelectItem value="IGM">
                <div className="flex flex-col">
                  <span className="font-medium">IGM</span>
                  <span className="text-sm text-muted-foreground">Info Gazette Médicale</span>
                </div>
              </SelectItem>
              <SelectItem value="ATLAS">
                <div className="flex flex-col">
                  <span className="font-medium">ATLAS</span>
                  <span className="text-sm text-muted-foreground">Atlas de Chirurgie</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
