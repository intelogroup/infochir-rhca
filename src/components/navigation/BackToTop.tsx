
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window && window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Safe check for window object
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", toggleVisibility);
      // Initial check
      toggleVisibility();
      
      // Cleanup
      return () => window.removeEventListener("scroll", toggleVisibility);
    }
    
    return undefined;
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="sm"
            className="rounded-full shadow-lg bg-primary/90 hover:bg-primary h-10 w-10"
            aria-label="Retour en haut"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
