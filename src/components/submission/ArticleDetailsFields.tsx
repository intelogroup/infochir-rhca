
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FileText, Users, Building2, Tag } from "lucide-react";

export interface ArticleDetailsFieldsProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export const ArticleDetailsFields = ({ form, disabled }: ArticleDetailsFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Détails de l'article</h3>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Titre
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Titre de l'article" 
                {...field} 
                disabled={disabled}
                className={disabled ? "opacity-70" : ""}
              />
            </FormControl>
            <FormDescription>
              Le titre doit être informatif et concis
            </FormDescription>
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
                placeholder="Liste des auteurs (séparés par des virgules)" 
                {...field} 
                disabled={disabled}
                className={disabled ? "opacity-70" : ""}
              />
            </FormControl>
            <FormDescription>
              Format: Nom Prénom, Nom Prénom, ...
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
                placeholder="Institution d'affiliation" 
                {...field}
                disabled={disabled}
                className={disabled ? "opacity-70" : ""} 
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
                placeholder="mots, clés, séparés, par, virgules" 
                {...field}
                disabled={disabled}
                className={disabled ? "opacity-70" : ""} 
              />
            </FormControl>
            <FormDescription>
              Entre 3 et 5 mots clés séparés par des virgules
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
