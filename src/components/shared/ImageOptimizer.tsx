
import { useState, useEffect } from 'react';
import { ImageFallback } from './ImageFallback';
import { createLogger } from "@/lib/error-logger";
import { getOptimizedImageUrl, getAlternativeRHCAUrl, extractBucketName, extractFilename } from '@/utils/imageOptimization';

const logger = createLogger('ImageOptimizer');

interface ImageOptimizerProps {
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

export const ImageOptimizer = ({
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
}: ImageOptimizerProps) => {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  // Reset error state when src changes
  useEffect(() => {
    setError(false);
    setIsLoaded(false);
    setCurrentSrc(src);
    setRetryCount(0);
  }, [src]);

  // If no src or empty string, show fallback immediately
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

  // Try to load an alternative URL if the current one fails
  const tryAlternativeUrl = () => {
    if (retryCount >= MAX_RETRIES) {
      setError(true);
      if (onError) onError();
      return;
    }

    // Get alternative URL based on patterns
    const alternativeUrl = getAlternativeRHCAUrl(currentSrc);
    if (alternativeUrl && alternativeUrl !== currentSrc) {
      logger.log(`[ImageOptimizer] Trying alternative URL: ${alternativeUrl}`);
      setRetryCount(prev => prev + 1);
      setCurrentSrc(alternativeUrl);
    } else {
      // If no alternative URL or we've reached max retries, show fallback
      logger.error(`[ImageOptimizer] No alternative URL available for: ${currentSrc}`);
      setError(true);
      if (onError) onError();
    }
  };

  // Handle successful load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
    
    // Log success with useful debug info
    const bucketName = extractBucketName(currentSrc);
    const filename = extractFilename(currentSrc);
    logger.log(`[ImageOptimizer] Successfully loaded image from ${bucketName ? `bucket: ${bucketName}` : 'URL'}, file: ${filename || currentSrc}`);
  };

  // Handle load error
  const handleError = () => {
    logger.error(`[ImageOptimizer] Failed to load image: ${currentSrc} (retry ${retryCount}/${MAX_RETRIES})`);
    
    // Try an alternative URL before giving up
    tryAlternativeUrl();
  };

  // Show fallback on error
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

  // Get optimized image URL
  const optimizedSrc = getOptimizedImageUrl(currentSrc, width, height);

  // Return standard img tag for web environments
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
