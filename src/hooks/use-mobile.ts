
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is a mobile device based on screen width
 * @param breakpoint The max width to consider as mobile (default: 768px)
 * @returns Boolean indicating if the device is mobile
 */
export const useIsMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (for SSR)
    if (typeof window === 'undefined') return;
    
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Check on mount
    checkMobile();
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
};
