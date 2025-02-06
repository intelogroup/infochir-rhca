
import { useEffect } from "react";

export const useScrollToTop = () => {
  useEffect(() => {
    try {
      console.log("[useScrollToTop] Attempting to scroll to top");
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      console.log("[useScrollToTop] Successfully scrolled to top");
    } catch (error) {
      console.error("[useScrollToTop] Failed to scroll:", error);
    }
  }, []); // Run only once on mount
};

