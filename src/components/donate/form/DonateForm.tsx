
import { useState } from "react";
import { motion } from "framer-motion";
import { DonationAmountSelector } from "@/components/donate/form/DonationAmountSelector";
import { createCheckoutSession } from "@/lib/stripe";
import { toast } from "sonner";
import { FormError } from "@/components/donate/form/FormError";
import { DonationButton } from "@/components/donate/form/DonationButton";
import { UserInfoFields } from "@/components/donate/form/UserInfoFields";

export const DonateForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);

  // Form validation
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const amount = customAmount ? Number(customAmount) : selectedAmount;
  const isAmountValid = amount > 0 && amount <= 50000;

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const handleDonation = async () => {
    // Reset error state
    setFormError(null);
    
    try {
      if (!email) {
        setFormError("Veuillez entrer votre adresse email");
        setEmailTouched(true);
        return;
      }

      // Input validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFormError("Veuillez entrer une adresse email valide");
        setEmailTouched(true);
        return;
      }

      if (!isAmountValid) {
        setFormError(amount <= 0 
          ? "Veuillez sélectionner ou entrer un montant de don" 
          : "Le montant du don ne peut pas dépasser $50,000");
        return;
      }

      setIsProcessing(true);
      const toastId = toast.loading("Traitement de votre don...");

      // Use the secure helper function
      await createCheckoutSession(amount, {
        donor_info: {
          name,
          email,
          is_anonymous: !name,
          message: '' // Include empty message field
        }
      });
      
      toast.success("Redirection vers la page de paiement...", { id: toastId });

    } catch (error: any) {
      console.error('[Donate] Payment error:', error);
      setFormError(error.message || "Impossible de traiter votre don");
      toast.error(error.message || "Impossible de traiter votre don");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      variants={formVariants}
      className="mt-8 space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
    >
      <FormError error={formError} />

      <UserInfoFields 
        email={email}
        setEmail={setEmail}
        name={name}
        setName={setName}
        emailTouched={emailTouched}
        setEmailTouched={setEmailTouched}
        isProcessing={isProcessing}
      />

      <motion.div variants={itemVariants}>
        <label className="text-sm font-medium mb-4 block">
          Select amount <span className="text-destructive">*</span>
        </label>
        <DonationAmountSelector
          selectedAmount={selectedAmount}
          customAmount={customAmount}
          onAmountChange={(amount) => {
            setSelectedAmount(amount);
            setCustomAmount("");
            setFormError(null);
          }}
          onCustomAmountChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedAmount(0);
            setFormError(null);
          }}
          isSubmitting={isProcessing}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DonationButton 
          isProcessing={isProcessing}
          disabled={!isEmailValid}
          onClick={handleDonation}
        />
      </motion.div>
    </motion.div>
  );
};
