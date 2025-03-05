
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterSubscribeFooter = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Veuillez fournir votre nom et email");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Traitement de votre inscription...");

    try {
      const { error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { name, email }
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
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-gray-900">Notre Newsletter</h3>
      </div>
      
      <p className="text-gray-600 text-sm">
        Inscrivez-vous pour recevoir nos dernières actualités et publications
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="footer-name" className="text-sm text-gray-600">
            Nom
          </Label>
          <Input
            id="footer-name"
            type="text"
            placeholder="Votre nom"
            className="bg-white/80 border-gray-200 focus:border-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="footer-email" className="text-sm text-gray-600">
            Email
          </Label>
          <Input
            id="footer-email"
            type="email"
            placeholder="Votre adresse email"
            className="bg-white/80 border-gray-200 focus:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="primary" 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};
