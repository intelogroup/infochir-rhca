
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollToTop = () => {
  let location;
  try {
    location = useLocation();
  } catch (error) {
    // If useLocation fails (no Router context), just scroll to top once
    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, []);
    return;
  }
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [location.pathname]);
};
