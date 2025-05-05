
import * as React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection"; 
import { CarouselSection } from "@/components/home/CarouselSection";
import { FoundersSection } from "@/components/home/FoundersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection"; 
import { StatsSection } from "@/components/home/StatsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { toast } from "sonner";

const Home = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Signal that the app has loaded completely to clear timeout in main.tsx
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Mark page as loaded
      setIsLoaded(true);
      window.dispatchEvent(new Event('app-loaded'));
      
      // Test email configuration in development mode
      if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
        testEmailConfig();
      }
    }
  }, []);

  // Function to test email configuration
  const testEmailConfig = async () => {
    try {
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
        console.error('Email config test failed:', error);
      } else if (data) {
        console.log('Email configuration status:', data);
        
        // Check API key status
        if (!data.api_key_status?.valid) {
          toast.error(`Email API key issue: ${data.api_key_status?.message}`);
        } else {
          toast.success('Resend API key is configured correctly');
        }
        
        // Check domain verification
        if (data.primary_domain_status && !data.primary_domain_status.verified) {
          toast.warning(`Domain verification issue: ${data.primary_domain_status.message}`);
        }
      }
    } catch (error) {
      console.error('Error checking email configuration:', error);
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
