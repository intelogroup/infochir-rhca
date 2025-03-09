
import { useRef, useEffect } from "react";

interface UseCarouselAutoplayOptions {
  enabled: boolean;
  api: any | null;
  interval?: number;
  pauseOnInteraction?: boolean;
  isInView?: boolean;
}

export const useCarouselAutoplay = ({
  enabled,
  api,
  interval = 5000,
  pauseOnInteraction = true,
  isInView = true,
}: UseCarouselAutoplayOptions) => {
  const intervalRef = useRef<number | null>(null);
  
  const startAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (!api || !enabled || !isInView) return;
    
    intervalRef.current = window.setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, interval) as unknown as number;
  };
  
  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Start/stop autoplay when deps change
  useEffect(() => {
    if (enabled && api && isInView) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    
    return stopAutoPlay;
  }, [enabled, api, isInView]);
  
  // For manual interaction handling
  const handleManualInteraction = () => {
    if (pauseOnInteraction) {
      stopAutoPlay();
      if (enabled && isInView) {
        startAutoPlay();
      }
    }
  };
  
  return {
    startAutoPlay,
    stopAutoPlay,
    handleManualInteraction,
    isPlaying: !!intervalRef.current,
  };
};
