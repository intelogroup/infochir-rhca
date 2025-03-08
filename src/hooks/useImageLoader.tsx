
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getOptimizedImageUrl, getAlternativeRHCAUrl } from '@/utils/imageOptimization';
import { useComponentLifecycle } from '@/hooks/useComponentLifecycle';
import { useImageContext } from '@/contexts/ImageContext';

interface UseImageLoaderProps {
  src: string | undefined;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export const useImageLoader = ({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false 
}: UseImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { isMounted } = useComponentLifecycle();
  const retryTimerRef = useRef<number | null>(null);
  const imageContext = useImageContext();
  
  // Memoize the optimized image URL to prevent recalculations
  const optimizedSrc = useMemo(() => {
    if (!src) return "";
    return getOptimizedImageUrl(src, width, height);
  }, [src, width, height]);
  
  // Clean up any pending timers on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  // Handle image loading using our context
  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    
    // Clear any existing retry timers
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    
    if (!optimizedSrc) {
      console.warn(`[ImageOptimizer:WARN] No source URL provided for image: ${alt}`);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    console.log(`[ImageOptimizer:INFO] Loading image from: ${optimizedSrc}, alt: ${alt}`);

    // Set the src immediately
    setImageSrc(optimizedSrc);
    
    // Use the context to preload the image
    imageContext.preloadImage(optimizedSrc, priority);
    
    // Check image status and update component state
    const checkImageStatus = () => {
      if (!isMounted()) return;
      
      const status = imageContext.getImageStatus(optimizedSrc);
      
      if (status.loaded) {
        setIsLoading(false);
        setHasError(false);
      } else if (status.error) {
        handleImageError();
      } else {
        // Still loading, check again in a bit
        retryTimerRef.current = window.setTimeout(checkImageStatus, 200);
      }
    };
    
    checkImageStatus();
    
    return () => {
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, [optimizedSrc, alt, priority, isMounted, imageContext]);
  
  // Memoize the error handler to prevent recreating on each render
  const handleImageError = useCallback(() => {
    if (isMounted()) {
      console.error(`[ImageOptimizer:ERROR] Failed to load image from: ${src}`);
      
      // If we've already retried 3 times, give up
      if (retryCount >= 2) {
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      // Try alternative URL for RHCA covers
      const alternativeUrl = src ? getAlternativeRHCAUrl(src) : null;
      if (alternativeUrl) {
        setRetryCount(prev => prev + 1);
        
        // Use setTimeout with a ref for proper cleanup
        retryTimerRef.current = window.setTimeout(() => {
          if (isMounted()) {
            const optimizedAltSrc = getOptimizedImageUrl(alternativeUrl, width, height);
            setImageSrc(optimizedAltSrc);
            imageContext.preloadImage(optimizedAltSrc, priority);
          }
          
          retryTimerRef.current = null;
        }, 500);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    }
  }, [src, width, height, retryCount, isMounted, imageContext, priority]);

  return {
    isLoading,
    hasError,
    imageSrc,
    setHasError
  };
};
