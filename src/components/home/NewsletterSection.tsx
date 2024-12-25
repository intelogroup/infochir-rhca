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
    <section className="py-16 bg-gradient-to-br from-primary to-primary-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="w-12 h-12 mx-auto mb-6 text-white/80" />
        <h2 className="text-3xl font-bold mb-4 text-white">Restez informé</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Abonnez-vous à notre newsletter pour recevoir les dernières publications et actualités
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Votre adresse email"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <Button 
            variant="secondary" 
            type="submit" 
            className="whitespace-nowrap"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Inscription..." : "S'abonner"}
          </Button>
        </form>
      </div>
    </section>
  );
};