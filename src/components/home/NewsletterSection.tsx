import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer une adresse email");
      return;
    }
    toast.success("Merci de votre inscription à notre newsletter!");
    setEmail("");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary to-primary-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Newspaper className="w-12 h-12 mx-auto mb-6 text-white/80" />
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
          />
          <Button variant="secondary" type="submit" className="whitespace-nowrap">
            S'abonner
          </Button>
        </form>
      </div>
    </section>
  );
};