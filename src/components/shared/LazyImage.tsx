
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { memo, useState, useEffect, useRef, useCallback } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

const LazyImage = memo(({ 
  src, 
  alt, 
  className = "", 
  width, 
  height, 
  onLoad,
  priority = false,
  objectFit = "cover"
}: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Add width and height parameters to the image URL
  const optimizedSrc = React.useMemo(() => {
    if (!src) return "";
    if (!width || !height) return src;
    
    try {
      const url = new URL(src);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('fit', objectFit);
      return url.toString();
    } catch (e) {
      // If URL parsing fails, just append parameters
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}w=${width}&h=${height}&fit=${objectFit}`;
    }
  }, [src, width, height, objectFit]);
  
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  }, [onLoad]);
  
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);
  }, [src]);
  
  useEffect(() => {
    const currentRef = imgRef.current;
    
    // If image is already in viewport or has priority, load immediately
    if (priority) {
      return;
    }
    
    // Check if IntersectionObserver is available
    if (!window.IntersectionObserver || !currentRef) {
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
        // If element is in viewport, set the src attribute to load the image
        if (entry.isIntersecting && currentRef) {
          currentRef.src = optimizedSrc;
          cleanup(); // Stop observing once loaded
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
  }, [optimizedSrc, priority]);

  // Object fit style based on prop
  const objectFitStyle = React.useMemo(() => {
    return { objectFit } as React.CSSProperties;
  }, [objectFit]);

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && !hasError && (
        <Skeleton className={className} style={{ width, height }} />
      )}
      
      {hasError && (
        <div 
          className={`${className} bg-gray-100 flex items-center justify-center text-gray-400`} 
          style={{ width, height }}
        >
          <span className="text-xs">Image unavailable</span>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={priority ? optimizedSrc : ""} // Only set src immediately if priority
        data-src={optimizedSrc} // Store the src for lazy loading
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        width={width}
        height={height}
        style={objectFitStyle}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
