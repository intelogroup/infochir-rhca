
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { Info, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export interface ArticleDetailsProps {
  form: UseFormReturn<ArticleFormData>;
}

export const ArticleDetails = ({ form }: ArticleDetailsProps) => {
  const abstractValue = form.watch("abstract") || "";
  const abstractLength = abstractValue.length;
  const isAbstractTooShort = abstractLength > 0 && abstractLength < 50;
  const isAbstractTooLong = abstractLength > 2000;
  const isAbstractValid = abstractLength >= 50 && abstractLength <= 2000;
  
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
                onBlur={(e) => {
                  field.onBlur();
                  if (e.target.value.trim().length < 3) {
                    form.setError("title", {
                      type: "manual",
                      message: "Le titre doit contenir au moins 3 caractères"
                    });
                  }
                }}
              />
            </FormControl>
            <div className="flex justify-between items-center mt-1">
              <FormMessage />
              {field.value && <span className="text-xs text-muted-foreground">{field.value.length}/200 caractères</span>}
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="abstract"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Résumé</FormLabel>
            <div className="flex items-center gap-1 -mt-1 mb-1">
              {isAbstractValid ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <Info className="h-3 w-3" />
                  <span>Le résumé doit contenir entre 50 et 2000 caractères</span>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-amber-500 flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>
                    {isAbstractTooShort && "Le résumé est trop court (minimum 50 caractères)"}
                    {isAbstractTooLong && "Le résumé est trop long (maximum 2000 caractères)"}
                  </span>
                </motion.div>
              )}
            </div>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Résumé de l'article"
                className={`min-h-[150px] ${form.formState.errors.abstract ? "border-red-300 focus-visible:ring-red-500" : ""}`}
                onChange={(e) => {
                  field.onChange(e);
                  
                  // Immediate validation feedback
                  const length = e.target.value.length;
                  if (length > 0 && length < 50) {
                    form.setError("abstract", {
                      type: "manual",
                      message: "Le résumé doit contenir au moins 50 caractères"
                    });
                  } else if (length > 2000) {
                    form.setError("abstract", {
                      type: "manual",
                      message: "Le résumé ne doit pas dépasser 2000 caractères"
                    });
                  } else if (length > 0) {
                    form.clearErrors("abstract");
                  }
                }}
              />
            </FormControl>
            <div className="flex justify-end">
              <span className={`text-xs ${
                isAbstractTooShort || isAbstractTooLong ? "text-destructive" : 
                abstractLength > 0 ? "text-green-600" : "text-muted-foreground"
              }`}>
                {abstractLength} / 2000 caractères
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
