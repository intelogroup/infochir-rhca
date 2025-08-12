import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { X, Plus, Tag } from "lucide-react";
import { useState } from "react";

interface SimplifiedTagsSectionProps {
  form: UseFormReturn<ArticleFormData>;
}

export const SimplifiedTagsSection = ({ form }: SimplifiedTagsSectionProps) => {
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = form.getValues("tags") || [];
      form.setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Tag className="h-5 w-5" />
        Tags
      </h3>
      
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags *</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter un tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(field.value || []).map((tag, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Ajoutez des tags pour faciliter la recherche de l'article
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};