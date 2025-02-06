
import { useEffect } from "react";

export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []); // Run only once on mount
};
