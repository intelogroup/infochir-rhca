
import { useState, useEffect } from 'react';
import { optimizeImageUrl, getAlternativeRHCAUrl } from '@/utils/imageLoader';
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('useImageLoader');

interface UseImageLoaderProps {
  src: string | undefined;
  alt: string;
  width?: number;
  height?: number;
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
  const MAX_RETRIES = 2;

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    
    if (!src) {
      logger.warn(`No source URL provided for image: ${alt}`);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const loadImage = () => {
      const img = new Image();
      
      // Preload critical images with higher priority
      if (priority) {
        img.fetchPriority = 'high';
      }
      
      // Get optimized image URL
      const optimizedSrc = optimizeImageUrl(src, { width, height, priority });
      img.src = optimizedSrc;
      setImageSrc(optimizedSrc);

      img.onload = () => {
        setIsLoading(false);
        setHasError(false);
      };

      img.onerror = () => {
        logger.error(`Failed to load image from: ${optimizedSrc}`);
        
        // If we've already retried too many times, give up
        if (retryCount >= MAX_RETRIES) {
          setHasError(true);
          setIsLoading(false);
          return;
        }
        
        // Check if this is an RHCA cover by the URL pattern
        const isRhcaCover = src.includes('RHCA_vol_') || 
                           src.includes('rhca_covers') || 
                           src.includes('rhca-covers');
        
        // Try alternative URL for RHCA covers
        if (isRhcaCover) {
          const alternativeUrl = getAlternativeRHCAUrl(src);
          if (alternativeUrl && alternativeUrl !== src) {
            logger.log(`Trying alternative URL: ${alternativeUrl}`);
            setRetryCount(prev => prev + 1);
            
            const newImg = new Image();
            const optimizedAltSrc = optimizeImageUrl(alternativeUrl, { width, height, priority });
            newImg.src = optimizedAltSrc;
            setImageSrc(optimizedAltSrc);
            
            newImg.onload = () => {
              setIsLoading(false);
              setHasError(false);
            };
            
            newImg.onerror = () => {
              setRetryCount(prev => prev + 1);
              setHasError(true);
              setIsLoading(false);
            };
          } else {
            setHasError(true);
            setIsLoading(false);
          }
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      };
    };

    loadImage();
  }, [src, width, height, alt, retryCount, priority]);

  return {
    isLoading,
    hasError,
    imageSrc,
    setHasError
  };
};

export default useImageLoader;
