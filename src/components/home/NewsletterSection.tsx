
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema for the contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export const NewsletterSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with zod resolver
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });

  const handleSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Envoi en cours...");

    try {
      console.log("Submitting contact form:", values);
      
      // First, save to database
      const { data: dbData, error: dbError } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: values.name,
            email: values.email,
            phone: values.phone || null,
            message: values.message
          }
        ]);

      // Log database response for debugging
      if (dbError) {
        console.error("Contact form database error:", dbError);
        throw new Error(`Database error: ${dbError.message}`);
      } else {
        console.log("Database insert successful:", dbData);
      }

      // Send email notification
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { 
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          message: values.message
        }
      });

      if (error) {
        console.error("Contact form submission error:", error);
        throw new Error(`Email sending error: ${error.message}`);
      }

      toast.success("Merci pour votre message! Nous vous contacterons bientôt.", {
        id: toastId
      });
      
      // Reset form values
      form.reset();
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      toast.error(`Une erreur est survenue: ${error.message || "Veuillez réessayer plus tard"}`, {
        id: toastId
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary-light opacity-95" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white bg-clip-text">
            Contactez-nous
          </h2>
          
          <p className="text-lg text-white/90 mb-4 max-w-2xl mx-auto">
            Envoyez-nous un message pour toute question, suggestion ou collaboration
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-white">
              Envoyez-nous un message
            </h3>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-white/90 text-sm font-medium">
                        Nom*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Votre nom"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                          disabled={isSubmitting}
                          autoComplete="name"
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-white/90 text-sm font-medium">
                        Téléphone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Votre numéro"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                          disabled={isSubmitting}
                          autoComplete="tel"
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-white/90 text-sm font-medium">
                      Email*
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Votre adresse email"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                        disabled={isSubmitting}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-white/90 text-sm font-medium">
                      Message*
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Votre message"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 min-h-[120px]"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Button 
                  variant="secondary" 
                  type="submit" 
                  className="w-full bg-white text-primary hover:bg-white/90 transition-all duration-300 py-6 text-lg font-medium shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                </Button>
              </motion.div>
              
              <p className="text-white/60 text-sm text-center mt-4">
                * Champs obligatoires
              </p>
            </form>
          </Form>
        </div>
      </motion.div>
    </section>
  );
};
