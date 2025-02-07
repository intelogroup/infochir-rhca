
import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import { DonateHeader } from "@/components/donate/DonateHeader";
import { DonateForm } from "@/components/donate/DonateForm";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BackButton = () => {
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
};

const Donate = () => {
  console.log("[Donate] Component mounting");
  useScrollToTop();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDonation = async (
    paymentMethod: string, 
    donorInfo: {
      name: string;
      email: string;
      isAnonymous: boolean;
      message: string;
    },
    amount: number
  ) => {
    console.log("[Donate] Processing donation with Stripe Checkout");
    try {
      setIsProcessing(true);

      // Create Stripe Checkout session
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          amount,
          currency: 'usd',
          donor_info: {
            name: donorInfo.isAnonymous ? null : donorInfo.name,
            email: donorInfo.email,
            message: donorInfo.message,
            is_anonymous: donorInfo.isAnonymous
          }
        }
      });

      if (sessionError) {
        console.error("[Donate] Session creation error:", sessionError);
        throw sessionError;
      }

      // Use top-level redirect for Stripe Checkout
      console.log("[Donate] Redirecting to Stripe Checkout:", sessionData?.url);
      if (sessionData?.url) {
        window.top.location.href = sessionData.url;
      }

    } catch (error: any) {
      console.error('[Donate] Payment error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white pt-[50px]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <BackButton />
          <DonateHeader />
          
          <div className="grid gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <DonateForm
                onSubmit={handleDonation}
                isProcessing={isProcessing}
              />
            </motion.div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </MainLayout>
  );
};

export default Donate;
