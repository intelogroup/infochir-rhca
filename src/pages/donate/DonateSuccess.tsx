
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { verifyPaymentStatus } from "@/lib/stripe";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const DonateSuccess = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      toast.error("Invalid request");
      navigate('/donate');
      return;
    }

    const verifyPayment = async () => {
      try {
        setIsLoading(true);
        // Security: Verify the payment with the server
        const verified = await verifyPaymentStatus(sessionId);
        
        if (verified) {
          setIsVerified(true);
          toast.success("Thank you for your donation!");
        } else {
          toast.error("Unable to verify payment status");
          // Don't redirect - show verification failed message instead
        }
      } catch (error) {
        console.error('[DonateSuccess] Verification error:', error);
        toast.error("Payment verification failed");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center pt-[150px]">
          <LoadingSpinner size="lg" variant="primary" text="Vérification de votre paiement..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-[50px]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="shadow-lg backdrop-blur-sm bg-white/80 border-gray-100/20">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
              {isVerified ? (
                <>
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Thank You for Your Donation!
                  </h1>
                  <p className="text-center text-gray-600 max-w-md">
                    Your support helps us continue our mission. We've sent you a confirmation email with the details of your donation.
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="h-16 w-16 text-amber-500" />
                  <h1 className="text-3xl font-bold text-center text-amber-600">
                    Payment Verification Pending
                  </h1>
                  <p className="text-center text-gray-600 max-w-md">
                    We're still processing your donation. If you've completed the payment, it should be verified shortly. Please contact us if you have any questions.
                  </p>
                </>
              )}
              <Button
                onClick={() => navigate('/')}
                className="mt-6"
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DonateSuccess;
