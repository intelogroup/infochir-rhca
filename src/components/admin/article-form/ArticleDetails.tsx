
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";

interface ArticleDetailsProps {
  form: UseFormReturn<ArticleFormData>;
}

export const ArticleDetails = ({ form }: ArticleDetailsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre de l'article</FormLabel>
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
            <FormLabel>Résumé</FormLabel>
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
    </div>
  );
};
