
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getOptimizedImageUrl, getAlternativeRHCAUrl } from '@/utils/imageOptimization';
import { useComponentLifecycle } from '@/hooks/useComponentLifecycle';

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

  // Memoize the onload handler to prevent recreating on each render
  const handleImageLoad = useCallback(() => {
    if (isMounted()) {
      console.log(`[ImageOptimizer:SUCCESS] Image loaded successfully: ${src}`);
      setIsLoading(false);
      setHasError(false);
    }
  }, [src, isMounted]);
  
  // Memoize the error handler to prevent recreating on each render
  const handleImageError = useCallback((error: any) => {
    if (isMounted()) {
      console.error(`[ImageOptimizer:ERROR] Failed to load image from: ${src}`, error);
      
      // If we've already retried 3 times, give up
      if (retryCount >= 2) {
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      // Try alternative URL for RHCA covers
      const alternativeUrl = getAlternativeRHCAUrl(src);
      if (alternativeUrl) {
        setRetryCount(prev => prev + 1);
        
        // Use setTimeout with a ref for proper cleanup
        retryTimerRef.current = window.setTimeout(() => {
          if (isMounted()) {
            const newImg = new Image();
            const optimizedAltSrc = getOptimizedImageUrl(alternativeUrl, width, height);
            setImageSrc(optimizedAltSrc);
            newImg.src = optimizedAltSrc;
          }
          
          retryTimerRef.current = null;
        }, 500);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    }
  }, [src, width, height, retryCount, isMounted]);

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
    
    if (!src) {
      console.warn(`[ImageOptimizer:WARN] No source URL provided for image: ${alt}`);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    console.log(`[ImageOptimizer:INFO] Loading image from: ${src}, alt: ${alt}`);

    const loadImage = () => {
      const img = new Image();
      
      // Preload critical images with higher priority
      if (priority) {
        img.fetchPriority = 'high';
      }
      
      setImageSrc(optimizedSrc);

      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      
      // Start loading the image
      img.src = optimizedSrc;
    };

    loadImage();

    // Clean up function
    return () => {
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [src, optimizedSrc, width, height, alt, retryCount, priority, handleImageLoad, handleImageError]);

  return {
    isLoading,
    hasError,
    imageSrc,
    setHasError
  };
};
