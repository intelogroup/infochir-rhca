
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { X, Plus, Users, Building2 } from "lucide-react";
import { useState } from "react";

interface AuthorInformationSectionProps {
  form: UseFormReturn<ArticleFormData>;
}

export const AuthorInformationSection = ({ form }: AuthorInformationSectionProps) => {
  const [newAuthor, setNewAuthor] = useState("");
  const [newCoAuthor, setNewCoAuthor] = useState("");
  const [newAffiliation, setNewAffiliation] = useState("");

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

  const addCoAuthor = () => {
    if (newCoAuthor.trim()) {
      const currentCoAuthors = form.getValues("coAuthors") || [];
      form.setValue("coAuthors", [...currentCoAuthors, newCoAuthor.trim()]);
      setNewCoAuthor("");
    }
  };

  const removeCoAuthor = (index: number) => {
    const currentCoAuthors = form.getValues("coAuthors") || [];
    form.setValue("coAuthors", currentCoAuthors.filter((_, i) => i !== index));
  };

  const addAffiliation = () => {
    if (newAffiliation.trim()) {
      const currentAffiliations = form.getValues("authorAffiliations") || [];
      form.setValue("authorAffiliations", [...currentAffiliations, newAffiliation.trim()]);
      setNewAffiliation("");
    }
  };

  const removeAffiliation = (index: number) => {
    const currentAffiliations = form.getValues("authorAffiliations") || [];
    form.setValue("authorAffiliations", currentAffiliations.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Informations sur les auteurs
      </h3>
      
      <FormField
        control={form.control}
        name="primaryAuthor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Auteur principal *</FormLabel>
            <FormControl>
              <Input
                placeholder="Nom de l'auteur principal..."
                {...field}
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
            <FormLabel>Auteurs *</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter un auteur..."
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
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="coAuthors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Co-auteurs</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter un co-auteur..."
                    value={newCoAuthor}
                    onChange={(e) => setNewCoAuthor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCoAuthor())}
                  />
                  <Button type="button" onClick={addCoAuthor} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(field.value || []).map((coAuthor, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {coAuthor}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeCoAuthor(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="authorAffiliations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Affiliations des auteurs</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter une affiliation..."
                    value={newAffiliation}
                    onChange={(e) => setNewAffiliation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAffiliation())}
                  />
                  <Button type="button" onClick={addAffiliation} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(field.value || []).map((affiliation, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {affiliation}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeAffiliation(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </FormControl>
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
              Institution *
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Nom de l'institution..."
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
