
import { useEffect } from "react";

export const useScrollToTop = () => {
  useEffect(() => {
    const performScroll = () => {
      try {
        console.log("[useScrollToTop] Attempting to scroll to top");
        
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        
        console.log("[useScrollToTop] Successfully scrolled to top");
      } catch (error) {
        console.error("[useScrollToTop] Smooth scroll failed:", error);
        // Fallback to instant scroll
        try {
          window.scrollTo(0, 0);
          console.log("[useScrollToTop] Used fallback scroll");
        } catch (fallbackError) {
          console.error("[useScrollToTop] Fallback scroll failed:", fallbackError);
        }
      }
    };

    // Execute scroll on mount
    performScroll();

    // Listen for route changes via URL
    const handleRouteChange = () => {
      console.log("[useScrollToTop] Route change detected");
      performScroll();
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);
};
