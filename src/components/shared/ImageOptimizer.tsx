import React, { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageFallback } from "./ImageFallback";

// Helper to determine if we're debugging
const isDebugMode = process.env.NODE_ENV === 'development' || 
                   process.env.VITE_APP_PREVIEW === 'true' || 
                   process.env.DEBUG === 'true';

interface ImageOptimizerProps {
  src: string | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackText?: string;
  priority?: boolean;
}

export const ImageOptimizer = ({ 
  src, 
  alt, 
  className = "", 
  width = 400,
  height = 300,
  fallbackText,
  priority = false
}: ImageOptimizerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Optimize the src URL if dimensions are provided
  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    
    // Don't modify if it's a data URL or SVG
    if (src.startsWith('data:') || src.endsWith('.svg')) return src;
    
    // Add width and height for remote images when possible
    try {
      const url = new URL(src);
      
      // Only add dimensions if not already present
      if (!url.searchParams.has('w') && !url.searchParams.has('width') && width) {
        url.searchParams.append('w', width.toString());
      }
      
      if (!url.searchParams.has('h') && !url.searchParams.has('height') && height) {
        url.searchParams.append('h', height.toString());
      }
      
      return url.toString();
    } catch (e) {
      // If URL parsing fails, return the original
      return src;
    }
  }, [src, width, height]);
  
  useEffect(() => {
    if (!optimizedSrc) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    
    // For priority images, preload immediately
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedSrc;
      document.head.appendChild(link);
      
      // Clean up preload link
      return () => {
        document.head.removeChild(link);
      };
    }
    
    // Otherwise load normally
    const img = new Image();
    img.src = optimizedSrc;
    
    img.onload = () => {
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      if (isDebugMode) {
        console.error(`Failed to load image: ${optimizedSrc}`);
      }
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [optimizedSrc, priority]);

  if (isLoading) {
    return <Skeleton className={`${className} bg-muted`} style={{ width, height }} />;
  }

  if (hasError || !optimizedSrc) {
    return (
      <ImageFallback
        alt={alt}
        width={width}
        height={height}
        className={className}
        fallbackText={fallbackText}
      />
    );
  }

  return (
    <img 
      src={optimizedSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      onError={() => setHasError(true)}
    />
  );
};
