import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const DonateSuccess = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      toast.success("Thank you for your donation!");
      setIsLoading(false);
    } else {
      navigate('/donate');
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Thank You for Your Donation!
              </h1>
              <p className="text-center text-gray-600 max-w-md">
                Your support helps us continue our mission. We've sent you a confirmation email with the details of your donation.
              </p>
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
