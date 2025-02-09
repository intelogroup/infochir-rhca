
import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import { DonateHeader } from "@/components/donate/DonateHeader";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getStripe } from "@/lib/stripe";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DonationAmountSelector } from "@/components/donate/form/DonationAmountSelector";

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
  useScrollToTop();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleDonation = async () => {
    try {
      if (!email) {
        toast.error("Please enter your email address");
        return;
      }

      const amount = customAmount ? Number(customAmount) : selectedAmount;
      if (!amount) {
        toast.error("Please select or enter a donation amount");
        return;
      }

      setIsProcessing(true);

      const { data: sessionData, error: sessionError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          amount,
          currency: 'usd',
          donor_info: {
            name,
            email,
            is_anonymous: !name,
          }
        }
      });

      if (sessionError) {
        console.error("[Donate] Session creation error:", sessionError);
        throw new Error(sessionError.message || "Failed to create checkout session");
      }

      if (!sessionData?.session_id) {
        throw new Error("No session ID returned from server");
      }

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: sessionData.session_id
      });

      if (redirectError) {
        console.error("[Donate] Redirect error:", redirectError);
        throw redirectError;
      }

    } catch (error: any) {
      console.error('[Donate] Payment error:', error);
      toast.error(error.message || "Failed to process donation");
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
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <BackButton />
          </div>
          
          <div className="max-w-2xl mx-auto">
            <DonateHeader />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email (required)</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Name (optional)</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-4 block">Select amount</label>
                <DonationAmountSelector
                  selectedAmount={selectedAmount}
                  customAmount={customAmount}
                  onAmountChange={(amount) => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  onCustomAmountChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                />
              </div>

              <Button
                onClick={handleDonation}
                disabled={isProcessing}
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white relative overflow-hidden group"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span>Continue to Payment</span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </MainLayout>
  );
};

export default Donate;
