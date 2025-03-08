
import { useEffect, useRef, useState } from 'react';
import { createLogger } from "@/lib/error-logger";
import { useLocation } from 'react-router-dom';

const logger = createLogger('useScrollToTop');

// Track global scroll operations to prevent overlapping attempts across components
const globalScrollState = {
  isScrolling: false,
  lastScrollTime: 0,
  scrollAttempts: 0,
  maxScrollAttempts: 3
};

interface ScrollOptions {
  behavior?: ScrollBehavior;
  debounceTime?: number;
  maxAttempts?: number;
  forceScroll?: boolean;
}

const defaultOptions: ScrollOptions = {
  behavior: 'instant',
  debounceTime: 300,
  maxAttempts: 3,
  forceScroll: false
};

/**
 * Hook to scroll to top when route changes
 * @param {string} key - A stable key that changes with route transitions (optional, uses location key if not provided)
 * @param {ScrollOptions} options - Configuration options for the scroll behavior
 */
export const useScrollToTop = (key?: string, options: ScrollOptions = {}) => {
  const location = useLocation();
  const scrollKey = key || location.pathname;
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Create refs to track state for this specific instance
  const lastScrollTimeRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const scrollAttemptsRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);
  const [scrollError, setScrollError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Clear any pending timeout when the component unmounts or key changes
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [scrollKey]);
  
  useEffect(() => {
    // Reset attempt counter when key changes
    scrollAttemptsRef.current = 0;
    
    // Skip scrolling if we're already in the process of scrolling and not forcing
    if (isScrollingRef.current && !mergedOptions.forceScroll) {
      logger.log("Skipping scroll attempt - already scrolling");
      return;
    }
    
    // Prevent multiple scroll attempts within the debounce period
    const now = Date.now();
    if (now - lastScrollTimeRef.current < mergedOptions.debounceTime! && 
        now - globalScrollState.lastScrollTime < mergedOptions.debounceTime! && 
        !mergedOptions.forceScroll) {
      logger.log(`Skipping duplicate scroll attempt for key: ${scrollKey}`);
      return;
    }
    
    // Update tracking state
    lastScrollTimeRef.current = now;
    globalScrollState.lastScrollTime = now;
    isScrollingRef.current = true;
    globalScrollState.isScrolling = true;
    scrollAttemptsRef.current++;
    globalScrollState.scrollAttempts++;
    
    logger.log(`Attempting to scroll to top for key: ${scrollKey} (attempt ${scrollAttemptsRef.current})`);
    
    // Use requestAnimationFrame to ensure DOM is ready before scrolling
    const scrollHandler = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: mergedOptions.behavior
        });
        logger.log("Successfully scrolled to top");
        setScrollError(null);
        isScrollingRef.current = false;
        globalScrollState.isScrolling = false;
      } catch (error) {
        // Handle errors during scrolling
        const scrollError = error instanceof Error ? error : new Error('Unknown scroll error');
        logger.error("Error scrolling to top:", scrollError);
        setScrollError(scrollError);
        
        // Retry scrolling if we haven't exceeded the max attempts
        if (scrollAttemptsRef.current < mergedOptions.maxAttempts!) {
          logger.log(`Retrying scroll (attempt ${scrollAttemptsRef.current + 1} of ${mergedOptions.maxAttempts})`);
          timeoutRef.current = window.setTimeout(() => {
            isScrollingRef.current = false;
            globalScrollState.isScrolling = false;
            // Force scroll on retry
            useScrollToTop(scrollKey, { ...mergedOptions, forceScroll: true });
          }, 100);
        } else {
          logger.error(`Max scroll attempts (${mergedOptions.maxAttempts}) reached. Giving up.`);
          isScrollingRef.current = false;
          globalScrollState.isScrolling = false;
        }
      }
    };
    
    // Use two animation frames for better reliability across browsers
    timeoutRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollHandler);
      });
    }, 10);
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Clean up global state if this is the current scrolling operation
      if (isScrollingRef.current) {
        isScrollingRef.current = false;
        globalScrollState.isScrolling = false;
      }
    };
  }, [scrollKey, mergedOptions]);
  
  return { 
    scrollError, 
    isScrolling: isScrollingRef.current, 
    scrollAttempts: scrollAttemptsRef.current 
  };
};
