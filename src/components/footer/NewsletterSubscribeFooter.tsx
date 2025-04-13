
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { createLogger } from "@/lib/error-logger";

// Create a logger for this component
const logger = createLogger("NewsletterSubscribeFooter");

// Define validation schema for the newsletter form
const newsletterSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide")
});

export const NewsletterSubscribeFooter = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{name?: string; email?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    try {
      newsletterSchema.parse({ name, email });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: {name?: string; email?: string} = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "name") formattedErrors.name = err.message;
          if (err.path[0] === "email") formattedErrors.email = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Traitement de votre inscription...");

    try {
      logger.log("Submitting newsletter subscription:", { name, email });
      
      // Use direct fetch for better control over the request
      const response = await fetch("https://llxzstqejdrplmxdjxlu.supabase.co/functions/v1/newsletter-subscribe", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
        },
        body: JSON.stringify({ name, email })
      });
      
      if (!response.ok) {
        let errorMessage = "Erreur lors de l'inscription";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `Erreur: ${response.status} ${response.statusText}`;
        } catch (e) {
          // If we can't parse JSON, use the status text
          errorMessage = `Erreur: ${response.status} ${response.statusText}`;
        }
        
        logger.error("Newsletter subscription error from response:", { status: response.status, message: errorMessage });
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.existingSubscription) {
        toast.info("Cette adresse email est déjà inscrite à notre newsletter", { id: toastId });
      } else {
        toast.success("Merci pour votre inscription à notre newsletter!", {
          id: toastId
        });
      }
      
      // Reset form
      setEmail("");
      setName("");
    } catch (error: any) {
      logger.error("Newsletter subscription error:", error);
      toast.error(`Une erreur est survenue: ${error.message || "Veuillez réessayer plus tard"}`, {
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
            name="footer-name"
            type="text"
            placeholder="Votre nom"
            className={`bg-white/80 border-gray-200 focus:border-primary ${errors.name ? "border-red-500" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="name"
            onBlur={() => validateForm()}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="footer-email" className="text-sm text-gray-600">
            Email
          </Label>
          <Input
            id="footer-email"
            name="footer-email"
            type="email"
            placeholder="Votre adresse email"
            className={`bg-white/80 border-gray-200 focus:border-primary ${errors.email ? "border-red-500" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="email"
            onBlur={() => validateForm()}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="default" 
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
