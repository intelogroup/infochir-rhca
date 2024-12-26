import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsGrid } from "@/components/home/ProductsGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          toast.error("Erreur de vérification de session");
          navigate("/auth");
          return;
        }
        
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

    if (!isAuthenticated) {
      checkSession();
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

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