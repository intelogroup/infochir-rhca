import React, { useState, useEffect } from 'react';
import { ImageFallback } from './ImageFallback';
import { getOptimizedImageUrl } from '@/utils/imageOptimization';
import { createLogger } from '@/lib/error-logger';
import { hasImageFailed, markImageAsFailed } from '@/utils/imageErrorHandler';

const logger = createLogger('OptimizedImageLoader');

interface OptimizedImageLoaderProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImageLoader = ({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackText,
  priority = false,
  loading,
  onLoad,
  onError
}: OptimizedImageLoaderProps) => {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  
  const MAX_RETRIES = 1; // Reduced retries to minimize console noise

  // Reset when src changes
  useEffect(() => {
    if (hasImageFailed(src)) {
      setError(true);
      return;
    }
    setError(false);
    setIsLoaded(false);
    setCurrentSrc(src);
    setRetryCount(0);
  }, [src]);

  // Return fallback immediately if no src
  if (!src || src === "") {
    return (
      <ImageFallback
        alt={alt}
        width={width}
        height={height}
        className={className}
        fallbackText={fallbackText || "Image non disponible"}
      />
    );
  }

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    if (retryCount < MAX_RETRIES) {
      // Try one simple alternative: different bucket naming
      const nextSrc = currentSrc
        .replace('rhca_covers', 'rhca-covers')
        .replace('atlas_covers', 'article_covers')
        .replace('igm_covers', 'igm-covers');
      
      if (nextSrc !== currentSrc) {
        logger.log(`[OptimizedImageLoader] Retrying with alternative bucket name: ${nextSrc}`);
        setRetryCount(prev => prev + 1);
        setCurrentSrc(nextSrc);
        return;
      }
    }
    
    // Log RHCA-specific failures for debugging
    if (currentSrc.includes('rhca')) {
      logger.warn(`[OptimizedImageLoader] RHCA image failed to load: ${currentSrc}`);
    }
    
    // Mark as failed and show fallback
    markImageAsFailed(src);
    setError(true);
    if (onError) onError();
  };

  if (error) {
    return (
      <ImageFallback
        alt={alt}
        width={width}
        height={height}
        className={className}
        fallbackText={fallbackText || "Image non disponible"}
      />
    );
  }

  const optimizedSrc = getOptimizedImageUrl(currentSrc, width, height);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading || (priority ? 'eager' : 'lazy')}
      onLoad={handleLoad}
      onError={handleError}
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
    />
  );
};