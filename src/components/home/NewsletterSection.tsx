import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!email) {
        toast.error("Veuillez entrer une adresse email");
        return;
      }

      if (!email.includes('@')) {
        toast.error("Veuillez entrer une adresse email valide");
        return;
      }

      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Merci de votre inscription à notre newsletter!");
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="py-16 sm:py-20 bg-gradient-to-br from-primary to-primary-light"
      role="region"
      aria-labelledby="newsletter-title"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail 
          className="w-12 h-12 mx-auto mb-6 text-white/80 animate-fade-up" 
          aria-hidden="true"
        />
        <h2 
          id="newsletter-title"
          className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white animate-fade-up"
          tabIndex={0}
        >
          Restez informé
        </h2>
        <p 
          className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-up"
          tabIndex={0}
        >
          Abonnez-vous à notre newsletter pour recevoir les dernières publications et actualités
        </p>
        <form 
          onSubmit={handleSubscribe} 
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-fade-up"
          role="form"
          aria-label="Formulaire d'inscription à la newsletter"
        >
          <Input
            type="email"
            placeholder="Votre adresse email"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/40"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            aria-label="Adresse email"
            required
          />
          <Button 
            variant="secondary" 
            type="submit" 
            className="whitespace-nowrap font-medium hover:bg-white hover:text-primary transition-colors"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Inscription en cours..." : "S'abonner à la newsletter"}
          >
            {isSubmitting ? "Inscription..." : "S'abonner"}
          </Button>
        </form>
      </div>
    </section>
  );
};