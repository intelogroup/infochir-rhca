
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
  const MAX_RETRIES = 3;

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
      logger.error(`[ImageOptimizer] Max retries (${MAX_RETRIES}) reached for: ${currentSrc}`);
      setError(true);
      if (onError) onError();
      return;
    }

    // Check if this is an RHCA cover by the URL pattern
    const isRhcaCover = currentSrc.includes('RHCA_vol_') || 
                         currentSrc.includes('rhca_covers') || 
                         currentSrc.includes('rhca-covers');
                         
    // Try alternate bucket first
    if (isRhcaCover && currentSrc.includes('rhca_covers')) {
      const filename = extractFilename(currentSrc);
      if (filename) {
        const alternateUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-covers/${filename}`;
        logger.log(`[ImageOptimizer] Trying alternate bucket 'rhca-covers': ${alternateUrl}`);
        setRetryCount(prev => prev + 1);
        setCurrentSrc(alternateUrl);
        return;
      }
    } else if (isRhcaCover && currentSrc.includes('rhca-covers')) {
      const filename = extractFilename(currentSrc);
      if (filename) {
        const alternateUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/${filename}`;
        logger.log(`[ImageOptimizer] Trying alternate bucket 'rhca_covers': ${alternateUrl}`);
        setRetryCount(prev => prev + 1);
        setCurrentSrc(alternateUrl);
        return;
      }
    }
      
    // Get alternative URL based on patterns
    const alternativeUrl = isRhcaCover ? 
      getAlternativeRHCAUrl(currentSrc) : 
      null;
      
    if (alternativeUrl && alternativeUrl !== currentSrc) {
      logger.log(`[ImageOptimizer] Trying alternative URL (${retryCount + 1}/${MAX_RETRIES}): ${alternativeUrl}`);
      setRetryCount(prev => prev + 1);
      setCurrentSrc(alternativeUrl);
    } else if (isRhcaCover && retryCount < 1) {
      // For RHCA covers, try a simplified filename approach
      const filename = extractFilename(currentSrc);
      if (filename) {
        // Try to extract volume and issue from filename
        const match = filename.match(/RHCA_vol_(\d+)_no_(\d+)/i);
        if (match) {
          const vol = match[1].padStart(2, '0');
          const issue = match[2].padStart(2, '0');
          
          // Try simplified filename formats
          const simplifiedUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_${vol}_no_${issue}.png`;
          logger.log(`[ImageOptimizer] Trying simplified filename: ${simplifiedUrl}`);
          setRetryCount(prev => prev + 1);
          setCurrentSrc(simplifiedUrl);
          return;
        }
        
        // As a last resort, try direct bucket access with filename only
        const directUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/${filename}`;
        if (directUrl !== currentSrc) {
          logger.log(`[ImageOptimizer] Trying direct bucket URL: ${directUrl}`);
          setRetryCount(prev => prev + 1);
          setCurrentSrc(directUrl);
          return;
        }
      }
      // If we get here, no alternative was found
      setError(true);
      if (onError) onError();
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
