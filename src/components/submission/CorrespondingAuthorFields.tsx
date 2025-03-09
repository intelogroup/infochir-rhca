
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { User, Mail, Phone, MapPin } from "lucide-react";

export interface CorrespondingAuthorFieldsProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export const CorrespondingAuthorFields = ({ form, disabled }: CorrespondingAuthorFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Auteur correspondant</h3>
      
      <FormField
        control={form.control}
        name="correspondingAuthor.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nom complet
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Nom et prénom" 
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
        name="correspondingAuthor.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="email@example.com" 
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
        name="correspondingAuthor.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Téléphone
            </FormLabel>
            <FormControl>
              <Input 
                type="tel" 
                placeholder="+123 456 789" 
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
        name="correspondingAuthor.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresse postale
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Adresse postale complète" 
                {...field}
                disabled={disabled}
                className={disabled ? "opacity-70" : ""} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
