
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { FileText, Users, Building2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleDetailsFieldsProps {
  form: any;
  hasSubmissionAttempt?: boolean;
}

export const ArticleDetailsFields = ({ form, hasSubmissionAttempt = false }: ArticleDetailsFieldsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <FormField
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2" htmlFor="article-title">
              <FileText className="h-4 w-4" />
              Titre de l'article *
            </FormLabel>
            <FormControl>
              <Input 
                id="article-title"
                placeholder="Entrez le titre de votre article" 
                {...field}
                className={cn(
                  "bg-white/50 backdrop-blur-sm",
                  hasSubmissionAttempt && fieldState.error && "border-destructive ring-destructive focus:ring-destructive"
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="authors"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2" htmlFor="article-authors">
              <Users className="h-4 w-4" />
              Auteurs *
            </FormLabel>
            <FormControl>
              <Input 
                id="article-authors"
                placeholder="Noms des auteurs (séparés par des virgules)" 
                {...field}
                className={cn(
                  "bg-white/50 backdrop-blur-sm",
                  hasSubmissionAttempt && fieldState.error && "border-destructive ring-destructive focus:ring-destructive"
                )}
              />
            </FormControl>
            <FormDescription>
              Incluez le degré académique le plus élevé pour chaque auteur
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="institution"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2" htmlFor="article-institution">
              <Building2 className="h-4 w-4" />
              Institution *
            </FormLabel>
            <FormControl>
              <Input 
                id="article-institution"
                placeholder="Nom du département ou de l'institution" 
                {...field}
                className={cn(
                  "bg-white/50 backdrop-blur-sm",
                  hasSubmissionAttempt && fieldState.error && "border-destructive ring-destructive focus:ring-destructive"
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="keywords"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2" htmlFor="article-keywords">
              <Tag className="h-4 w-4" />
              Mots clés *
            </FormLabel>
            <FormControl>
              <Input 
                id="article-keywords"
                placeholder="3 à 5 mots clés séparés par des virgules" 
                {...field}
                className={cn(
                  "bg-white/50 backdrop-blur-sm",
                  hasSubmissionAttempt && fieldState.error && "border-destructive ring-destructive focus:ring-destructive"
                )}
              />
            </FormControl>
            <FormDescription>
              Correspondant à la liste des titres de sujets médicaux de l'Index Medicus
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};
