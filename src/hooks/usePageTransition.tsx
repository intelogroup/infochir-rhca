
import { useEffect, useState, useRef } from 'react';
import { Location } from 'react-router-dom';
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('PageTransition');

interface PageTransitionState {
  isTransitioning: boolean;
  transitionKey: string;
  previousLocation: Location | null;
}

/**
 * Custom hook to manage page transitions and ensure proper cleanup between route changes
 */
export const usePageTransition = (location: Location): PageTransitionState => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState<string>(() => 
    location.key || location.pathname || Math.random().toString(36).substring(2, 8)
  );
  const previousLocationRef = useRef<Location | null>(null);
  
  // Handle location changes
  useEffect(() => {
    // Early return if we don't have a previous location (first render)
    if (!previousLocationRef.current) {
      previousLocationRef.current = location;
      return;
    }
    
    // Skip if pathname hasn't changed (query params changed)
    if (previousLocationRef.current.pathname === location.pathname) {
      previousLocationRef.current = location;
      return;
    }

    const cleanup = () => {
      logger.log(`Cleaning up resources for route: ${previousLocationRef.current?.pathname}`);
      
      // Cancel any pending network requests specific to the previous route
      window.dispatchEvent(new CustomEvent('route-change', { 
        detail: { 
          from: previousLocationRef.current?.pathname,
          to: location.pathname 
        } 
      }));
      
      // Clear any route-specific timeouts or intervals
      // This is a general approach - specific timeouts should be cleared in component useEffect cleanups
      const routeTimers = window.__ROUTE_TIMERS__ || {};
      if (routeTimers[previousLocationRef.current?.pathname || '']) {
        routeTimers[previousLocationRef.current?.pathname || ''].forEach(
          (timerId: number) => window.clearTimeout(timerId)
        );
        delete routeTimers[previousLocationRef.current?.pathname || ''];
        window.__ROUTE_TIMERS__ = routeTimers;
      }
    };

    // Start transition
    setIsTransitioning(true);
    
    // After a short delay, perform cleanup and complete transition
    const transitionTimer = window.setTimeout(() => {
      cleanup();
      setTransitionKey(location.key || location.pathname || Math.random().toString(36).substring(2, 8));
      previousLocationRef.current = location;
      setIsTransitioning(false);
    }, 100); // Slightly faster than the animation duration
    
    // Clean up the transition timer if component unmounts
    return () => {
      window.clearTimeout(transitionTimer);
    };
  }, [location]);

  return {
    isTransitioning,
    transitionKey,
    previousLocation: previousLocationRef.current
  };
};

// Add global type for route timers
declare global {
  interface Window {
    __ROUTE_TIMERS__?: Record<string, number[]>;
  }
}
