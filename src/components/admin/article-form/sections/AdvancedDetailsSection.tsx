import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormData } from "@/types/article";
import { ChevronDown, ChevronRight, Settings, X, Plus } from "lucide-react";
import { useState } from "react";

interface AdvancedDetailsSectionProps {
  form: UseFormReturn<ArticleFormData>;
}

export const AdvancedDetailsSection = ({ form }: AdvancedDetailsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newAffiliation, setNewAffiliation] = useState("");

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Détails avancés (optionnel)
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-6 mt-4">
        {/* Institution */}
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution</FormLabel>
              <FormControl>
                <Input
                  placeholder="Institution de recherche..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Publication Details */}
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

        {/* Specialty */}
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

        {/* Keywords */}
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

        {/* Author Affiliations */}
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
              <FormDescription>
                Affiliations institutionnelles des auteurs
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Funding Source */}
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

        {/* DOI */}
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
      </CollapsibleContent>
    </Collapsible>
  );
};