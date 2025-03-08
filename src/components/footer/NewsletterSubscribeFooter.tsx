
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
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
  const [formError, setFormError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Validation states
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNameValid = name.trim().length > 0;
  
  const emailError = emailTouched && !isEmailValid ? "Email valide requis" : null;
  const nameError = nameTouched && !isNameValid ? "Nom requis" : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate inputs
    setEmailTouched(true);
    setNameTouched(true);
    
    if (!isEmailValid || !isNameValid) {
      setFormError("Veuillez remplir tous les champs correctement");
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
        setFormError("Une erreur est survenue lors de l'inscription");
        toast.error("Une erreur est survenue lors de l'inscription", {
          id: toastId
        });
        return;
      }

      toast.success("Merci pour votre inscription à notre newsletter!", {
        id: toastId
      });
      
      // Show success state
      setFormSubmitted(true);
      
      // Reset form after delay
      setTimeout(() => {
        setEmail("");
        setName("");
        setEmailTouched(false);
        setNameTouched(false);
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setFormError("Une erreur est survenue");
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
      
      {formError && (
        <div className="text-sm text-destructive flex items-center gap-1 p-2 bg-destructive/10 rounded border border-destructive/30">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}
      
      {formSubmitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700"
        >
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Merci pour votre inscription!</span>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="footer-name" className="text-sm text-gray-600 flex items-center justify-between">
              <span>Nom</span>
              {nameError && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {nameError}
                </span>
              )}
            </Label>
            <Input
              id="footer-name"
              type="text"
              placeholder="Votre nom"
              className={`bg-white/80 border-gray-200 focus:border-primary ${
                nameError ? "border-destructive" : nameTouched && isNameValid ? "border-green-500" : ""
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              required
              disabled={isSubmitting}
              aria-invalid={nameError ? "true" : undefined}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="footer-email" className="text-sm text-gray-600 flex items-center justify-between">
              <span>Email</span>
              {emailError && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {emailError}
                </span>
              )}
            </Label>
            <Input
              id="footer-email"
              type="email"
              placeholder="Votre adresse email"
              className={`bg-white/80 border-gray-200 focus:border-primary ${
                emailError ? "border-destructive" : emailTouched && isEmailValid ? "border-green-500" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              required
              disabled={isSubmitting}
              aria-invalid={emailError ? "true" : undefined}
            />
          </div>

          <motion.div
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            <Button 
              variant="default" 
              type="submit" 
              className="w-full relative"
              disabled={isSubmitting}
              aria-live="polite"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Inscription...
                </span>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </motion.div>
        </form>
      )}
    </div>
  );
};
