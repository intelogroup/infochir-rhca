
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { createLogger } from "@/lib/error-logger";
import { supabase } from "@/integrations/supabase/client";

// Create a logger for this component
const logger = createLogger("NewsletterSubscribeFooter");

// Storage key for pending subscriptions
const PENDING_SUBSCRIPTIONS_KEY = 'pendingSubscriptions';

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
  const [isOffline, setIsOffline] = useState(false);

  // Check online status and update state
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    // Set initial state
    setIsOffline(!navigator.onLine);

    // Add event listeners for online/offline status
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Check for pending subscriptions when online
    if (navigator.onLine) {
      const timer = setTimeout(() => {
        trySubmitPendingSubscriptions();
      }, 5000); // 5 second delay
      
      return () => clearTimeout(timer);
    }

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

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

  // Helper function to store subscription locally
  const storeLocalSubscription = () => {
    try {
      const localSubscriptions = JSON.parse(localStorage.getItem(PENDING_SUBSCRIPTIONS_KEY) || '[]');
      localSubscriptions.push({ name, email, date: new Date().toISOString() });
      localStorage.setItem(PENDING_SUBSCRIPTIONS_KEY, JSON.stringify(localSubscriptions));
      logger.log("Subscription stored locally");
      return true;
    } catch (err) {
      logger.error("Failed to store subscription locally:", err);
      return false;
    }
  };

  // Function to try submitting pending subscriptions
  const trySubmitPendingSubscriptions = async () => {
    try {
      const pendingStr = localStorage.getItem(PENDING_SUBSCRIPTIONS_KEY);
      if (!pendingStr) return;

      const pending = JSON.parse(pendingStr);
      if (!Array.isArray(pending) || pending.length === 0) return;

      logger.log(`Attempting to submit ${pending.length} pending subscriptions`);
      
      // Only try to submit one subscription per page load to avoid rate limiting
      const subscription = pending[0];
      const result = await submitSubscription(subscription.name, subscription.email, false);
      
      if (result.success) {
        // Remove the successful submission from pending
        const updatedPending = pending.slice(1);
        localStorage.setItem(PENDING_SUBSCRIPTIONS_KEY, JSON.stringify(updatedPending));
        logger.log(`Successfully submitted pending subscription, ${updatedPending.length} remaining`);
        
        if (updatedPending.length === 0) {
          toast.success("Toutes les inscriptions en attente ont été traitées", { duration: 3000 });
        }
      }
    } catch (err) {
      logger.error("Error processing pending subscriptions:", err);
    }
  };

  // Function to handle actual subscription submission
  const submitSubscription = async (
    subscriberName: string, 
    subscriberEmail: string,
    showToasts = true
  ) => {
    try {
      logger.log("Submitting newsletter subscription:", { name: subscriberName, email: subscriberEmail });
      
      // Check if we're offline
      if (!navigator.onLine) {
        throw new Error("Vous êtes hors ligne");
      }
      
      // Enhanced error logging for Supabase function invocation
      logger.log("Invoking Supabase function: newsletter-subscribe");
      
      // Try direct fetch as a fallback if supabase.functions.invoke doesn't work
      let response;
      
      try {
        // Try the edge function with improved error handling
        response = await supabase.functions.invoke("newsletter-subscribe", {
          body: { name: subscriberName, email: subscriberEmail }
        });
        
        logger.log("Supabase function response received:", response);
      } catch (error) {
        logger.warn("Supabase functions.invoke failed:", error);
        
        // Log detailed information about the error
        if (error instanceof Error) {
          logger.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: error.cause
          });
        } else {
          logger.error("Non-Error object thrown:", error);
        }
        
        throw error;
      }
      
      const { data, error } = response;
      
      if (error) {
        logger.error("Newsletter subscription error:", error);
        throw new Error(error.message || "Erreur lors de l'inscription");
      }
      
      logger.log("Newsletter subscription response:", data);
      
      if (showToasts) {
        if (data.existingSubscription) {
          toast.info("Cette adresse email est déjà inscrite à notre newsletter");
        } else {
          toast.success("Merci pour votre inscription à notre newsletter!");
        }
      }
      
      return { success: true, data };
    } catch (error: any) {
      logger.error("Newsletter subscription error:", error);
      
      // Store failed submission locally
      storeLocalSubscription();
      
      if (showToasts) {
        // More user-friendly error message
        if (!navigator.onLine) {
          toast.info(`Vous êtes hors ligne. Votre inscription a été enregistrée localement et sera envoyée lorsque vous serez à nouveau en ligne.`);
        } else {
          toast.error(`Une erreur est survenue, mais votre demande a été enregistrée localement`);
        }
      }
      
      return { success: false, error };
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
      const result = await submitSubscription(name, email);
      
      toast.dismiss(toastId);
      
      // Reset form on success or if stored locally
      setEmail("");
      setName("");
    } catch (error: any) {
      logger.error("Unexpected error during newsletter submission:", error);
      toast.error(`Une erreur inattendue est survenue`, { id: toastId });
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

        {isOffline && (
          <div className="text-amber-600 text-xs bg-amber-50 p-2 rounded border border-amber-200">
            Vous êtes actuellement hors ligne. Votre inscription sera enregistrée localement.
          </div>
        )}

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
