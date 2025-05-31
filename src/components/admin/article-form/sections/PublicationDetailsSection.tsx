
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { BookOpen } from "lucide-react";

interface PublicationDetailsSectionProps {
  form: UseFormReturn<ArticleFormData>;
}

export const PublicationDetailsSection = ({ form }: PublicationDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        Détails de publication
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume</FormLabel>
              <FormControl>
                <Input
                  placeholder="Volume..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro</FormLabel>
              <FormControl>
                <Input
                  placeholder="Numéro..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pageNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pages</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: 1-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Spécialité</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une spécialité" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="surgery">Chirurgie</SelectItem>
                <SelectItem value="anesthesiology">Anesthésiologie</SelectItem>
                <SelectItem value="cardiology">Cardiologie</SelectItem>
                <SelectItem value="orthopedics">Orthopédie</SelectItem>
                <SelectItem value="gastroenterology">Gastroentérologie</SelectItem>
                <SelectItem value="neurology">Neurologie</SelectItem>
                <SelectItem value="oncology">Oncologie</SelectItem>
                <SelectItem value="pediatrics">Pédiatrie</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
