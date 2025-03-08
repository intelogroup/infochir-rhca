
import { useRef, useEffect } from 'react';

/**
 * Custom hook to track component mount state and handle cleanup safely.
 * Helps prevent memory leaks by tracking if a component is mounted before updating state.
 */
export function useComponentLifecycle() {
  const isMountedRef = useRef(true);
  
  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      // Mark as unmounted when component is destroyed
      isMountedRef.current = false;
    };
  }, []);
  
  /**
   * Helper function to run callbacks only if component is still mounted
   * @param callback Function to execute if component is mounted
   */
  const runIfMounted = <T>(callback: () => T): T | undefined => {
    if (isMountedRef.current) {
      return callback();
    }
    return undefined;
  };

  /**
   * Creates an AbortController tied to component lifecycle
   * The controller will be aborted if the component unmounts
   */
  const createAbortController = () => {
    const controller = new AbortController();
    
    useEffect(() => {
      return () => {
        // Abort any pending requests when component unmounts
        controller.abort('Component unmounted');
      };
    }, []);
    
    return controller;
  };

  return {
    isMounted: () => isMountedRef.current,
    runIfMounted,
    createAbortController
  };
}
