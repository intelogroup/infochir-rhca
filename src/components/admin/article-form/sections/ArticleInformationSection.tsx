
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { FileText } from "lucide-react";

interface ArticleInformationSectionProps {
  form: UseFormReturn<ArticleFormData>;
}

export const ArticleInformationSection = ({ form }: ArticleInformationSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Informations de l'article
      </h3>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre de l'article *</FormLabel>
            <FormControl>
              <Input
                placeholder="Entrez le titre de l'article..."
                {...field}
                className="text-lg"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="abstract"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Résumé *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Entrez le résumé de l'article..."
                className="min-h-[120px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catégorie *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="research">Recherche</SelectItem>
                <SelectItem value="clinical">Clinique</SelectItem>
                <SelectItem value="review">Revue</SelectItem>
                <SelectItem value="case-study">Étude de cas</SelectItem>
                <SelectItem value="editorial">Éditorial</SelectItem>
                <SelectItem value="opinion">Opinion</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
