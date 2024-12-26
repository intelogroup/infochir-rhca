import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsGrid } from "@/components/home/ProductsGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          toast.error("Erreur de vérification de session");
          navigate("/auth");
          return;
        }
        
        console.log("Session status:", session ? "Active" : "No session");
        if (!session) {
          console.log("No session found, redirecting to auth");
          toast.error("Session expirée. Veuillez vous reconnecter.");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Unexpected error during session check:", error);
        toast.error("Une erreur inattendue est survenue");
        navigate("/auth");
      }
    };

    console.log("Auth state:", { isLoading, isAuthenticated });
    if (!isLoading && !isAuthenticated) {
      checkSession();
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, rendering null");
    return null;
  }

  console.log("Rendering Index page content");
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsSection />
          <ProductsGrid />
        </div>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;