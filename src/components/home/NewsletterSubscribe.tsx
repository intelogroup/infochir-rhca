
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Veuillez fournir au moins votre nom et email");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Traitement de votre inscription...");

    try {
      const { error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { name, email, phone }
      });

      if (error) {
        console.error("Newsletter subscription error:", error);
        toast.error("Une erreur est survenue lors de l'inscription", {
          id: toastId
        });
        return;
      }

      toast.success("Merci pour votre inscription à notre newsletter!", {
        id: toastId
      });
      setEmail("");
      setName("");
      setPhone("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Une erreur est survenue", {
        id: toastId
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Mail className="h-6 w-6 text-white" />
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-white">
            Restez informé
          </h3>
          
          <p className="text-sm text-white/90 mb-4">
            Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subscribe-name" className="text-white/90 text-sm font-medium">
              Nom*
            </Label>
            <Input
              id="subscribe-name"
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
            <Label htmlFor="subscribe-email" className="text-white/90 text-sm font-medium">
              Email*
            </Label>
            <Input
              id="subscribe-email"
              type="email"
              placeholder="Votre adresse email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscribe-phone" className="text-white/90 text-sm font-medium">
              Téléphone (optionnel)
            </Label>
            <Input
              id="subscribe-phone"
              type="tel"
              placeholder="Votre numéro"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="secondary" 
              type="submit" 
              className="w-full bg-white text-primary hover:bg-white/90 transition-all duration-300 font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </motion.div>
          
          <p className="text-white/60 text-xs text-center mt-4">
            * Champs obligatoires. Vous pourrez vous désinscrire à tout moment.
          </p>
        </form>
      </div>
    </motion.div>
  );
};
