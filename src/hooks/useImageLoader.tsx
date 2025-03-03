
import { useState, useEffect } from 'react';
import { getOptimizedImageUrl, getAlternativeRHCAUrl } from '@/utils/imageOptimization';

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

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    
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
      
      // Get optimized image URL
      const optimizedSrc = getOptimizedImageUrl(src, width, height);
      img.src = optimizedSrc;
      setImageSrc(optimizedSrc);

      img.onload = () => {
        console.log(`[ImageOptimizer:SUCCESS] Image loaded successfully: ${src}`);
        setIsLoading(false);
        setHasError(false);
      };

      img.onerror = (error) => {
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
          setTimeout(() => {
            const newImg = new Image();
            const optimizedAltSrc = getOptimizedImageUrl(alternativeUrl, width, height);
            newImg.src = optimizedAltSrc;
            setImageSrc(optimizedAltSrc);
          }, 500);
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      };
    };

    loadImage();

    return () => {
      // Clean up
    };
  }, [src, width, height, alt, retryCount, priority]);

  return {
    isLoading,
    hasError,
    imageSrc,
    setHasError
  };
};
