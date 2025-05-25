
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

  // Clean up the source URL - remove double slashes
  const cleanSrc = src.replace(/([^:]\/)\/+/g, '$1');

  // Try to load an alternative URL if the current one fails
  const tryAlternativeUrl = () => {
    if (retryCount >= MAX_RETRIES) {
      logger.error(`[ImageOptimizer] Max retries (${MAX_RETRIES}) reached for: ${currentSrc}`);
      setError(true);
      if (onError) onError();
      return;
    }

    // Check if this is an IGM cover
    const isIgmCover = currentSrc.includes('IGM_vol_') || 
                       currentSrc.includes('igm_covers') || 
                       currentSrc.includes('igm-covers');

    // Check if this is an RHCA cover by the URL pattern
    const isRhcaCover = currentSrc.includes('RHCA_vol_') || 
                         currentSrc.includes('rhca_covers') || 
                         currentSrc.includes('rhca-covers');
                         
    // Try alternate bucket first for IGM covers
    if (isIgmCover && currentSrc.includes('igm_covers')) {
      const filename = extractFilename(currentSrc);
      if (filename) {
        const alternateUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/igm-covers/${filename}`;
        logger.log(`[ImageOptimizer] Trying alternate IGM bucket 'igm-covers': ${alternateUrl}`);
        setRetryCount(prev => prev + 1);
        setCurrentSrc(alternateUrl);
        return;
      }
    } else if (isIgmCover && currentSrc.includes('igm-covers')) {
      const filename = extractFilename(currentSrc);
      if (filename) {
        const alternateUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/igm_covers/${filename}`;
        logger.log(`[ImageOptimizer] Trying alternate IGM bucket 'igm_covers': ${alternateUrl}`);
        setRetryCount(prev => prev + 1);
        setCurrentSrc(alternateUrl);
        return;
      }
    }

    // Try alternate bucket first for RHCA covers
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
    } else if ((isRhcaCover || isIgmCover) && retryCount < 1) {
      // For covers, try a simplified filename approach
      const filename = extractFilename(currentSrc);
      if (filename) {
        // Try to extract volume and issue from filename
        const rhcaMatch = filename.match(/RHCA_vol_(\d+)_no_(\d+)/i);
        const igmMatch = filename.match(/IGM_vol_(\d+)_no_(\d+)/i);
        
        if (rhcaMatch) {
          const vol = rhcaMatch[1].padStart(2, '0');
          const issue = rhcaMatch[2].padStart(2, '0');
          
          // Try additional formats - now try other extension types too
          const alternativeFormats = [
            `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_${vol}_no_${issue}.png`,
            `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_${vol}_no_${issue}.jpg`,
            `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-covers/RHCA_vol_${vol}_no_${issue}.png`,
            `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-covers/RHCA_vol_${vol}_no_${issue}.jpg`,
          ];
          
          const simplifiedUrl = alternativeFormats[0];
          logger.log(`[ImageOptimizer] Trying simplified RHCA format: ${simplifiedUrl}`);
          setRetryCount(prev => prev + 1);
          setCurrentSrc(simplifiedUrl);
          return;
        } else if (igmMatch) {
          const vol = igmMatch[1].padStart(2, '0');
          const issue = igmMatch[2].padStart(2, '0');
          
          // Try additional formats for IGM
          const alternativeFormats = [
            `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/igm_covers/IGM_vol_${vol}_no_${issue}.png`,
            `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/igm_covers/IGM_vol_${vol}_no_${issue}.jpg`,
            `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/igm-covers/IGM_vol_${vol}_no_${issue}.png`,
            `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/igm-covers/IGM_vol_${vol}_no_${issue}.jpg`,
          ];
          
          const simplifiedUrl = alternativeFormats[0];
          logger.log(`[ImageOptimizer] Trying simplified IGM format: ${simplifiedUrl}`);
          setRetryCount(prev => prev + 1);
          setCurrentSrc(simplifiedUrl);
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

  // Get optimized image URL from the cleaned source
  const optimizedSrc = getOptimizedImageUrl(cleanSrc, width, height);

  // Return standard img tag for web environments with crossOrigin attribute for CORS
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
      crossOrigin="anonymous"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
    />
  );
};
