
import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import { DonateHeader } from "@/components/donate/DonateHeader";
import { DonationSummary } from "@/components/donate/DonationSummary";
import { DonateForm } from "@/components/donate/DonateForm";
import { DonorInformation } from "@/components/donate/DonorInformation";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BackButton = () => {
  try {
    console.log("[BackButton] Attempting to render back button with router Link");
    return (
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light mb-6">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </Link>
    );
  } catch (error) {
    console.error("[BackButton] Failed to render router Link:", error);
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 text-primary hover:text-primary-light mb-6"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>
    );
  }
};

const Donate = () => {
  console.log("[Donate] Component mounting");
  useScrollToTop();

  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");

  const handleAmountSelect = (amount: number) => {
    console.log("[Donate] Amount selected:", amount);
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[Donate] Custom amount changed:", e.target.value);
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const handleDonation = async (paymentMethod: string) => {
    console.log("[Donate] Processing donation:", { paymentMethod, amount: customAmount || selectedAmount });
    try {
      setIsProcessing(true);
      const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
      
      if (!amount || amount <= 0) {
        throw new Error("Please select a valid donation amount");
      }

      if (!donorEmail) {
        throw new Error("Please provide your email address");
      }

      console.log("[Donate] Creating payment intent");
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount, currency: 'usd' }
      });

      if (stripeError) {
        console.error("[Donate] Stripe error:", stripeError);
        throw stripeError;
      }

      console.log("[Donate] Creating donation record");
      const { error: donationError } = await supabase
        .from('donations')
        .insert([
          {
            amount,
            currency: 'usd',
            status: 'pending',
            payment_intent_id: stripeData.id,
            donor_name: isAnonymous ? null : donorName,
            donor_email: donorEmail,
            message: message || null,
            is_anonymous: isAnonymous
          }
        ]);

      if (donationError) {
        console.error("[Donate] Database error:", donationError);
        throw donationError;
      }

      console.log("[Donate] Redirecting to Stripe checkout:", stripeData.url);
      window.location.href = stripeData.url;

    } catch (error: any) {
      console.error('[Donate] Payment error:', error);
      toast.error(error.message || "Failed to process donation");
    } finally {
      setIsProcessing(false);
    }
  };

  const currentAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white pt-[50px]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <BackButton />
          <DonateHeader />
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 space-y-6"
            >
              <DonateForm
                onAmountChange={handleAmountSelect}
                selectedAmount={selectedAmount}
                customAmount={customAmount}
                onCustomAmountChange={handleCustomAmountChange}
                onSubmit={handleDonation}
                isProcessing={isProcessing}
              />
              
              <DonorInformation
                donorName={donorName}
                donorEmail={donorEmail}
                isAnonymous={isAnonymous}
                message={message}
                onNameChange={setDonorName}
                onEmailChange={setDonorEmail}
                onAnonymousChange={setIsAnonymous}
                onMessageChange={setMessage}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <DonationSummary amount={currentAmount} />
            </motion.div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </MainLayout>
  );
};

export default Donate;
