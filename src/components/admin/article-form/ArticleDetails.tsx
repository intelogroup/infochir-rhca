
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { Info } from "lucide-react";

export interface ArticleDetailsProps {
  form: UseFormReturn<ArticleFormData>;
}

export const ArticleDetails = ({ form }: ArticleDetailsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Titre de l'article" 
                className={form.formState.errors.title ? "border-red-300 focus-visible:ring-red-500" : ""}
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
            <div className="text-xs text-muted-foreground flex items-center gap-1 -mt-1 mb-1">
              <Info className="h-3 w-3" />
              <span>Le résumé doit contenir entre 50 et 2000 caractères</span>
            </div>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Résumé de l'article"
                className={`min-h-[150px] ${form.formState.errors.abstract ? "border-red-300 focus-visible:ring-red-500" : ""}`}
              />
            </FormControl>
            <div className="flex justify-end">
              <span className={`text-xs ${field.value?.length > 2000 || field.value?.length < 50 ? "text-destructive" : "text-muted-foreground"}`}>
                {field.value?.length || 0} / 2000 caractères
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
