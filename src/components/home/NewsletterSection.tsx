import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light opacity-90" />
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <Mail className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-white">
            Restez Informé
          </h2>
          
          <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto">
            Abonnez-vous à notre newsletter pour recevoir les dernières publications et actualités
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              variant="secondary" 
              type="submit" 
              className="whitespace-nowrap hover:bg-white hover:text-primary transition-colors duration-300"
            >
              S'abonner
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};