import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { JournalBook, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

export const PublicationTypeField = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="publicationType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">Type de publication</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <RadioGroupItem
                  value="RHCA"
                  id="rhca"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="rhca"
                  className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <JournalBook className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">RHCA</div>
                    <div className="text-sm text-muted-foreground">
                      Revue Haïtienne de Chirurgie et d'Anesthésiologie
                    </div>
                  </div>
                </Label>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <RadioGroupItem
                  value="IGM"
                  id="igm"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="igm"
                  className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Newspaper className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">IGM</div>
                    <div className="text-sm text-muted-foreground">
                      Info Gazette Médicale
                    </div>
                  </div>
                </Label>
              </motion.div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};