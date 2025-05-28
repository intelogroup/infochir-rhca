
import * as React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection"; 
import { CarouselSection } from "@/components/home/CarouselSection";
import { SponsorsSection } from "@/components/home/SponsorsSection"; 
import { StatsSection } from "@/components/home/StatsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

const logger = createLogger('HomePage');

// Storage key for last check timestamp
const EMAIL_CONFIG_CHECK_KEY = 'email_config_last_check';
// Minimum time between checks (12 hours in milliseconds)
const MIN_CHECK_INTERVAL = 12 * 60 * 60 * 1000;

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
      
      // Test Supabase connection to identify any issues early
      testSupabaseConnection();
      
      // Only test email configurations in development mode and respect rate limits
      if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
        const shouldCheckEmailConfig = checkIfShouldTestEmailConfig();
        if (shouldCheckEmailConfig) {
          testEmailConfig();
        }
      }
    }
    
    // Cleanup function
    return () => {
      logger.info("Home page unmounted");
    };
  }, [isLoaded]);

  // Test Supabase connection to identify potential issues
  const testSupabaseConnection = async () => {
    try {
      logger.info("Testing Supabase connection...");
      const connected = await supabase.from('articles').select('id').limit(1).maybeSingle();
      
      if (connected.error) {
        logger.error("Supabase connection test failed:", connected.error);
        // Only show error toast in development mode
        if (import.meta.env.DEV) {
          toast.error("Connexion à Supabase échouée. Vérifiez votre connexion réseau.");
        }
      } else {
        logger.info("Supabase connection test succeeded");
      }
    } catch (error) {
      logger.error("Error testing Supabase connection:", error);
    }
  };

  // Function to determine if we should test email configuration based on last check time
  const checkIfShouldTestEmailConfig = () => {
    try {
      const lastCheckStr = localStorage.getItem(EMAIL_CONFIG_CHECK_KEY);
      if (!lastCheckStr) {
        return true; // No previous check, so we should check
      }
      
      const lastCheck = parseInt(lastCheckStr, 10);
      const now = Date.now();
      
      // Only check if enough time has passed since last check
      if (now - lastCheck > MIN_CHECK_INTERVAL) {
        return true;
      }
      
      logger.info(`Skipping email config check, last check was ${Math.round((now - lastCheck) / (60 * 60 * 1000))} hours ago`);
      return false;
    } catch (error) {
      logger.error('Error checking email config timestamp:', error);
      return false; // On error, don't check to prevent potential issues
    }
  };

  // Function to test email configuration
  const testEmailConfig = async () => {
    try {
      logger.info("Testing email configuration");
      
      // Record the check time immediately to prevent parallel requests
      localStorage.setItem(EMAIL_CONFIG_CHECK_KEY, Date.now().toString());
      
      const response = await fetch(
        'https://llxzstqejdrplmxdjxlu.supabase.co/functions/v1/check-email-config', 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        logger.error('Email config test failed with status:', response.status);
        return;
      }
      
      const { data, error } = await response.json();
      
      if (error) {
        logger.error('Email config test failed:', error);
        toast.error(`Erreur de configuration email: ${error.message || JSON.stringify(error)}`);
      } else if (data) {
        logger.info('Email configuration status:', data);
        
        // Check API key status
        if (!data.api_key_status?.valid) {
          toast.error(`Problème de clé API: ${data.api_key_status?.message}`);
        }
        
        // Check domain verification
        if (data.primary_domain_status && !data.primary_domain_status.verified) {
          toast.warning(`Problème de vérification du domaine: ${data.primary_domain_status?.message}`);
        }
      }
    } catch (error) {
      logger.error('Error checking email configuration:', error);
    }
  };

  return (
    <>
      <ErrorBoundary name="home-hero">
        <HeroSection />
      </ErrorBoundary>
      
      <ErrorBoundary name="home-products">
        <ProductsSection />
      </ErrorBoundary>
      
      <ErrorBoundary name="home-carousel">
        <CarouselSection />
      </ErrorBoundary>
      
      <ErrorBoundary name="home-sponsors">
        <SponsorsSection />
      </ErrorBoundary>
      
      <ErrorBoundary name="home-stats">
        <StatsSection />
      </ErrorBoundary>
      
      <ErrorBoundary name="home-newsletter">
        <NewsletterSection />
      </ErrorBoundary>
    </>
  );
};

export default Home;
