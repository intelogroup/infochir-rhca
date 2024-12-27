import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { FileText, Users, Building2, Tag } from "lucide-react";

export const ArticleDetailsFields = ({ form }: { form: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Titre de l'article
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Entrez le titre de votre article" 
                {...field}
                className="bg-white/50 backdrop-blur-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="authors"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Auteurs
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Noms des auteurs (séparés par des virgules)" 
                {...field}
                className="bg-white/50 backdrop-blur-sm"
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
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Institution
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Nom du département ou de l'institution" 
                {...field}
                className="bg-white/50 backdrop-blur-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Mots clés
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="3 à 5 mots clés séparés par des virgules" 
                {...field}
                className="bg-white/50 backdrop-blur-sm"
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