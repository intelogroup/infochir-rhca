
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { memo, useState, useEffect, useRef, useCallback } from "react";
import { useImageContext } from "@/contexts/ImageContext";
import { ImageFallback } from "./ImageFallback";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  fallbackText?: string;
}

const LazyImage = memo(({ 
  src, 
  alt, 
  className = "", 
  width, 
  height, 
  onLoad,
  priority = false,
  objectFit = "cover",
  fallbackText
}: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const imageContext = useImageContext();
  
  // Add width and height parameters to the image URL
  const optimizedSrc = React.useMemo(() => {
    if (!src) return "";
    if (!width || !height) return src;
    
    try {
      const url = new URL(src);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('fit', objectFit);
      url.searchParams.set('q', '75'); // Add quality parameter
      return url.toString();
    } catch (e) {
      // If URL parsing fails, just append parameters
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}w=${width}&h=${height}&fit=${objectFit}&q=75`;
    }
  }, [src, width, height, objectFit]);
  
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  }, [onLoad]);
  
  const handleError = useCallback(() => {
    console.error(`[LazyImage] Error loading image: ${src}`);
    setIsLoading(false);
    setHasError(true);
  }, [src]);

  // Reset state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);
  
  // Handle intersection observer for lazy loading
  useEffect(() => {
    const currentRef = imgRef.current;
    
    // If image is already in viewport or has priority, load immediately
    if (priority) {
      setIsVisible(true);
      return;
    }
    
    // Check if IntersectionObserver is available
    if (!window.IntersectionObserver || !currentRef) {
      // Fallback to eager loading if no IntersectionObserver
      setIsVisible(true);
      return;
    }
    
    // Cleanup function for the observer
    const cleanup = () => {
      if (observer.current && currentRef) {
        observer.current.unobserve(currentRef);
        observer.current = null;
      }
    };
    
    // Create the observer
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If element is in viewport, trigger loading
        if (entry.isIntersecting) {
          setIsVisible(true);
          cleanup(); // Stop observing once visible
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading when image is 200px from viewport
      threshold: 0.01 // Trigger when at least 1% of the image is visible
    });
    
    // Start observing
    observer.current.observe(currentRef);
    
    // Cleanup on unmount
    return cleanup;
  }, [priority]);

  // Start loading the image when it becomes visible
  useEffect(() => {
    if (!isVisible || !optimizedSrc) return;
    
    // Use our image context to preload
    imageContext.preloadImage(optimizedSrc, priority);
    
    // Check image status periodically
    const checkImageStatus = () => {
      const status = imageContext.getImageStatus(optimizedSrc);
      
      if (status.loaded) {
        handleLoad();
      } else if (status.error) {
        handleError();
      } else if (isVisible) {
        // Continue checking until loaded or error
        setTimeout(checkImageStatus, 200);
      }
    };
    
    checkImageStatus();
  }, [isVisible, optimizedSrc, handleLoad, handleError, imageContext, priority]);

  // Object fit style based on prop
  const objectFitStyle = React.useMemo(() => {
    return { objectFit } as React.CSSProperties;
  }, [objectFit]);

  // Progressive loading technique
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  
  // Update loaded source when image actually loads
  const onImageLoad = useCallback(() => {
    setLoadedSrc(optimizedSrc);
    handleLoad();
  }, [optimizedSrc, handleLoad]);

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && !hasError && (
        <Skeleton className={`${className} absolute inset-0 z-10`} style={{ width, height }} />
      )}
      
      {hasError && (
        <ImageFallback
          alt={alt}
          width={width || 100}
          height={height || 100}
          className={className}
          fallbackText={fallbackText}
        />
      )}
      
      {isVisible && !hasError && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          className={`${className} transition-opacity duration-500 ${
            loadedSrc ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={onImageLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          width={width}
          height={height}
          style={objectFitStyle}
          decoding={priority ? "sync" : "async"}
        />
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
