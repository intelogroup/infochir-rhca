
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    try {
      console.log("[useScrollToTop] Current path:", location.pathname);
      console.log("[useScrollToTop] Attempting to scroll to top");
      
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      
      console.log("[useScrollToTop] Successfully scrolled to top");
    } catch (error) {
      console.error("[useScrollToTop] Error occurred:", error);
      // Fallback to simpler scroll if smooth scroll fails
      try {
        window.scrollTo(0, 0);
        console.log("[useScrollToTop] Used fallback scroll");
      } catch (fallbackError) {
        console.error("[useScrollToTop] Fallback scroll failed:", fallbackError);
      }
    }
  }, [location.pathname]); // Re-run on route change
};
