
import { useEffect, useRef } from 'react';
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useScrollToTop');

/**
 * Hook to scroll to top when route changes
 * @param {string} key - A stable key that changes with route transitions
 */
export const useScrollToTop = (key: string) => {
  const lastScrollTimeRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Skip scrolling if we're already in the process of scrolling
    if (isScrollingRef.current) {
      return;
    }
    
    // Prevent multiple scroll attempts within a short time period
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 300) {
      logger.log("Skipping duplicate scroll attempt");
      return;
    }
    
    lastScrollTimeRef.current = now;
    logger.log(`Attempting to scroll to top for key: ${key}`);
    
    isScrollingRef.current = true;
    
    // Use requestAnimationFrame to ensure DOM is ready before scrolling
    const scrollHandler = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' as ScrollBehavior
        });
        logger.log("Successfully scrolled to top");
      } catch (error) {
        logger.error("Error scrolling to top:", error);
      } finally {
        isScrollingRef.current = false;
      }
    };
    
    // Use two animation frames for better reliability across browsers
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollHandler);
    });
    
    // Cleanup function
    return () => {
      isScrollingRef.current = false;
    };
  }, [key]);
};
