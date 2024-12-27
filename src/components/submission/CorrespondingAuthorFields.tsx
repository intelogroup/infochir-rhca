import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin } from "lucide-react";

export const CorrespondingAuthorFields = ({ form }: { form: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold">Auteur correspondant</h3>
      <div className="grid gap-4">
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
                <Input {...field} className="bg-white/50 backdrop-blur-sm" />
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
                <Input type="email" {...field} className="bg-white/50 backdrop-blur-sm" />
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
                <Input {...field} className="bg-white/50 backdrop-blur-sm" />
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
                Adresse
              </FormLabel>
              <FormControl>
                <Input {...field} className="bg-white/50 backdrop-blur-sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};