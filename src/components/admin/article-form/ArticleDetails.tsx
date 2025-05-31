
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface ArticleDetailsProps {
  form: UseFormReturn<ArticleFormData>;
}

export const ArticleDetails = ({ form }: ArticleDetailsProps) => {
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCoAuthor, setNewCoAuthor] = useState("");
  const [newAffiliation, setNewAffiliation] = useState("");

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

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = form.getValues("keywords") || [];
      form.setValue("keywords", [...currentKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = form.getValues("keywords") || [];
    form.setValue("keywords", currentKeywords.filter((_, i) => i !== index));
  };

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
    <div className="space-y-8">
      {/* Article Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Informations de l'article</h3>
        
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

      {/* Author Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Informations sur les auteurs</h3>
        
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
              <FormLabel>Institution *</FormLabel>
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

      {/* Publication Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Détails de publication</h3>
        
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

      {/* Tags and Keywords */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Tags et mots-clés</h3>
        
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

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mots-clés</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter un mot-clé..."
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(field.value || []).map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {keyword}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeKeyword(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Mots-clés académiques pour l'indexation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Informations supplémentaires</h3>
        
        <FormField
          control={form.control}
          name="fundingSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source de financement</FormLabel>
              <FormControl>
                <Input
                  placeholder="Source de financement de la recherche..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DOI</FormLabel>
              <FormControl>
                <Input
                  placeholder="10.1000/182"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Digital Object Identifier (optionnel)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
