import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Inscription en cours...");

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          { name, email, phone }
        ]);

      if (error) {
        if (error.code === '23505') {
          toast.error("Cette adresse email est déjà inscrite à notre newsletter", {
            id: toastId
          });
        } else {
          console.error("Newsletter subscription error:", error);
          toast.error("Une erreur est survenue lors de l'inscription", {
            id: toastId
          });
        }
        return;
      }

      toast.success("Merci de votre inscription à notre newsletter!", {
        id: toastId
      });
      setEmail("");
      setName("");
      setPhone("");
    } catch (error) {
      console.error("Newsletter submission error:", error);
      toast.error("Une erreur est survenue lors de l'inscription", {
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
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
          <Mail className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="text-4xl font-bold mb-4 text-white bg-clip-text">
          Restez Informé
        </h2>
        
        <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto">
          Abonnez-vous à notre newsletter pour recevoir les dernières publications et actualités
        </p>
        
        <form onSubmit={handleSubscribe} className="space-y-4 max-w-xl mx-auto backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-white/90 text-sm font-medium">
                Nom*
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-white/90 text-sm font-medium">
                Téléphone
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Votre numéro"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-white/90 text-sm font-medium">
              Email*
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Votre adresse email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

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
              {isSubmitting ? "Inscription en cours..." : "S'abonner à la Newsletter"}
            </Button>
          </motion.div>
          
          <p className="text-white/60 text-sm text-center mt-4">
            * Champs obligatoires
          </p>
        </form>
      </motion.div>
    </section>
  );
};