
import * as React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection"; 
import { CarouselSection } from "@/components/home/CarouselSection";
import { FoundersSection } from "@/components/home/FoundersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection"; 
import { StatsSection } from "@/components/home/StatsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('HomePage');

const Home = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Signal that the app has loaded completely to clear timeout in main.tsx
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Mark page as loaded immediately to prevent double refresh issues
      if (!isLoaded) {
        setIsLoaded(true);
        window.dispatchEvent(new Event('app-loaded'));
        logger.info("Home page mounted and app-loaded event dispatched");
      }
      
      // Test email configurations only in development mode
      if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
        testEmailConfig();
      }
    }
    
    // Cleanup function
    return () => {
      logger.info("Home page unmounted");
    };
  }, [isLoaded]);

  // Function to test email configuration
  const testEmailConfig = async () => {
    try {
      logger.info("Testing email configuration");
      toast.loading("Vérification de la configuration des emails...");
      
      const { data, error } = await fetch(
        'https://llxzstqejdrplmxdjxlu.supabase.co/functions/v1/check-email-config', 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(res => res.json());
      
      if (error) {
        logger.error('Email config test failed:', error);
        toast.dismiss();
        toast.error(`Erreur de configuration email: ${error.message || JSON.stringify(error)}`);
      } else if (data) {
        logger.info('Email configuration status:', data);
        toast.dismiss();
        
        // Check API key status
        if (!data.api_key_status?.valid) {
          toast.error(`Problème de clé API: ${data.api_key_status?.message}`);
        } else {
          toast.success('La clé API Resend est correctement configurée');
          
          // Check domain verification
          if (data.primary_domain_status && !data.primary_domain_status.verified) {
            toast.warning(`Problème de vérification du domaine: ${data.primary_domain_status?.message}`);
          } else if (data.primary_domain_status?.verified) {
            toast.success('Le domaine est correctement vérifié');
          }
        }
      }
    } catch (error) {
      logger.error('Error checking email configuration:', error);
      toast.dismiss();
      toast.error("Erreur lors de la vérification de la configuration email");
    }
  };

  return (
    <>
      <HeroSection />
      <ProductsSection />
      <CarouselSection />
      <FoundersSection />
      <SponsorsSection />
      <StatsSection />
      <NewsletterSection />
    </>
  );
};

export default Home;
