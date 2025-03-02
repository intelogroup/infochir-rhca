
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    const performScroll = () => {
      try {
        console.log("[useScrollToTop] Attempting to scroll to top for path:", pathname);
        
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

    // Execute scroll on route change
    performScroll();
  }, [pathname]);
};
