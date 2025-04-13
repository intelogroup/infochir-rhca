
import { useState, useEffect } from 'react';
import { getOptimizedImageUrl, getAlternativeRHCAUrl } from '@/utils/imageOptimization';
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useImageLoader');

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
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    setUsedFallback(false);
    
    if (!src) {
      logger.warn(`[useImageLoader] No source URL provided for image: ${alt}`);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    logger.log(`[useImageLoader] Loading image from: ${src}, alt: ${alt}`);

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
        logger.log(`[useImageLoader] Image loaded successfully: ${src}`);
        setIsLoading(false);
        setHasError(false);
      };

      img.onerror = (error) => {
        logger.error(`[useImageLoader] Failed to load image from: ${optimizedSrc}`, error);
        
        // If we've already retried with the alternative URL, give up
        if (usedFallback || retryCount >= 2) {
          // Try with the original URL without optimization as a last resort
          if (!usedFallback && optimizedSrc !== src) {
            logger.log(`[useImageLoader] Trying original URL as fallback: ${src}`);
            setUsedFallback(true);
            setImageSrc(src);
            const fallbackImg = new Image();
            fallbackImg.src = src;
            fallbackImg.onload = () => {
              setIsLoading(false);
              setHasError(false);
            };
            fallbackImg.onerror = () => {
              setHasError(true);
              setIsLoading(false);
            };
          } else {
            setHasError(true);
            setIsLoading(false);
          }
          return;
        }
        
        // Try alternative URL for RHCA covers
        const alternativeUrl = getAlternativeRHCAUrl(src);
        if (alternativeUrl && alternativeUrl !== src) {
          logger.log(`[useImageLoader] Trying alternative URL: ${alternativeUrl}`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            const newImg = new Image();
            const optimizedAltSrc = getOptimizedImageUrl(alternativeUrl, width, height);
            newImg.src = optimizedAltSrc;
            setImageSrc(optimizedAltSrc);
            
            newImg.onload = () => {
              logger.log(`[useImageLoader] Alternative image loaded successfully: ${alternativeUrl}`);
              setIsLoading(false);
              setHasError(false);
            };
            
            newImg.onerror = () => {
              logger.error(`[useImageLoader] Failed to load alternative image: ${alternativeUrl}`);
              // If alternative also fails, try without filename modifications
              setUsedFallback(true);
              setHasError(true);
              setIsLoading(false);
            };
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
  }, [src, width, height, alt, retryCount, priority, usedFallback]);

  return {
    isLoading,
    hasError,
    imageSrc,
    setHasError
  };
};
