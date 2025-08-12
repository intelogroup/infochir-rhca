import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { X, Plus, Users } from "lucide-react";
import { useState } from "react";

interface SimplifiedAuthorSectionProps {
  form: UseFormReturn<ArticleFormData>;
}

export const SimplifiedAuthorSection = ({ form }: SimplifiedAuthorSectionProps) => {
  const [newAuthor, setNewAuthor] = useState("");

  const addAuthor = () => {
    if (newAuthor.trim()) {
      const currentAuthors = form.getValues("authors") || [];
      form.setValue("authors", [...currentAuthors, newAuthor.trim()]);
      setNewAuthor("");
    }
  };

  const removeAuthor = (index: number) => {
    const currentAuthors = form.getValues("authors") || [];
    form.setValue("authors", currentAuthors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Auteurs
      </h3>
      
      <FormField
        control={form.control}
        name="authors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Auteurs *</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom de l'auteur..."
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                  />
                  <Button type="button" onClick={addAuthor} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(field.value || []).map((author, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {author}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeAuthor(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Ajoutez tous les auteurs de l'article
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};