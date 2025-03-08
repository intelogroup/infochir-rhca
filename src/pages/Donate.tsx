
import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { motion, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { DonateHeader } from "@/components/donate/DonateHeader";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, AlertCircle } from "lucide-react";
import { createCheckoutSession } from "@/lib/stripe";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DonationAmountSelector } from "@/components/donate/form/DonationAmountSelector";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const BackButton = () => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="gap-2 text-primary hover:text-primary-light"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      Retour
    </Button>
  );
};

const Donate = () => {
  // Use with default path-based key
  useScrollToTop();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);

  // Form validation
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = emailTouched && !isEmailValid ? "Veuillez entrer une adresse email valide" : null;
  
  const amount = customAmount ? Number(customAmount) : selectedAmount;
  const isAmountValid = amount > 0 && amount <= 50000;

  // Optimized animations
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
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Content */}
        <LazyMotion features={domAnimation}>
          <div className="relative max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8">
              <BackButton />
            </div>
            
            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key="donate-form"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <DonateHeader />
                  
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="my-4"
                    >
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{formError}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    variants={formVariants}
                    className="mt-8 space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                  >
                    <motion.div variants={itemVariants} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Email <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => setEmailTouched(true)}
                          placeholder="Enter your email"
                          required
                          aria-invalid={emailError ? "true" : undefined}
                          aria-describedby={emailError ? "email-error" : undefined}
                          className={emailError ? "border-destructive" : ""}
                          disabled={isProcessing}
                        />
                        {emailError && (
                          <p id="email-error" className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> 
                            {emailError}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name (optional)</label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          disabled={isProcessing}
                        />
                      </div>
                    </motion.div>

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

                    <motion.div 
                      variants={itemVariants}
                      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    >
                      <Button
                        onClick={handleDonation}
                        disabled={isProcessing || !isEmailValid}
                        className="w-full h-14 text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white relative overflow-hidden group"
                        aria-live="polite"
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Continue to Payment
                            <Heart className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </LazyMotion>
      </div>
    </MainLayout>
  );
};

export default Donate;
