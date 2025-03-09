
import React, { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageFallback } from "./ImageFallback";

// Helper to determine if we're debugging
const isDebugMode = import.meta.env.DEV || 
                   import.meta.env.VITE_APP_PREVIEW === 'true' || 
                   import.meta.env.DEBUG === 'true';

// Detect if we're in preview mode (for CORS handling)
const isPreviewMode = 
  typeof window !== 'undefined' && 
  (window.location.hostname.includes('preview') || 
   window.location.hostname.includes('lovable.app')) ||
  import.meta.env.VITE_APP_PREVIEW === 'true';

interface ImageOptimizerProps {
  src: string | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackText?: string;
  priority?: boolean;
  crossOrigin?: "anonymous" | "use-credentials" | "";
}

export const ImageOptimizer = ({ 
  src, 
  alt, 
  className = "", 
  width = 400,
  height = 300,
  fallbackText,
  priority = false,
  crossOrigin = "anonymous"
}: ImageOptimizerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Optimize the src URL if dimensions are provided
  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    
    // Don't modify if it's a data URL or SVG
    if (src.startsWith('data:') || src.endsWith('.svg')) return src;
    
    // Check if it's a Supabase URL and log for debugging
    const isSupabaseUrl = src.includes('supabase.co') || src.includes('llxzstqejdrplmxdjxlu');
    
    if (isDebugMode && isSupabaseUrl) {
      console.log(`Loading Supabase image: ${src}`);
    }
    
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
      
      // For Supabase storage URLs in preview mode, attempt to add a timestamp to bust cache
      if (isPreviewMode && isSupabaseUrl) {
        url.searchParams.append('t', Date.now().toString());
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
      // Add crossOrigin attribute for CORS images
      if (optimizedSrc.includes('supabase.co') || !optimizedSrc.includes(window.location.hostname)) {
        link.crossOrigin = crossOrigin;
      }
      document.head.appendChild(link);
      
      // Clean up preload link
      return () => {
        document.head.removeChild(link);
      };
    }
    
    // Otherwise load normally
    const img = new Image();
    img.src = optimizedSrc;
    
    // Add crossOrigin attribute for CORS images
    if (optimizedSrc.includes('supabase.co') || !optimizedSrc.includes(window.location.hostname)) {
      img.crossOrigin = crossOrigin;
    }
    
    img.onload = () => {
      setIsLoading(false);
      if (isDebugMode && (optimizedSrc.includes('supabase.co') || optimizedSrc.includes('llxzstqejdrplmxdjxlu'))) {
        console.log(`Successfully loaded Supabase image: ${optimizedSrc}`);
      }
    };
    
    img.onerror = (e) => {
      setHasError(true);
      setIsLoading(false);
      if (isDebugMode) {
        const isSupabaseUrl = optimizedSrc.includes('supabase.co') || optimizedSrc.includes('llxzstqejdrplmxdjxlu');
        console.error(`Failed to load image${isSupabaseUrl ? ' from Supabase' : ''}: ${optimizedSrc}`, e);
      }
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [optimizedSrc, priority, crossOrigin]);

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
      crossOrigin={
        // Add crossOrigin attribute for CORS images
        (optimizedSrc.includes('supabase.co') || !optimizedSrc.includes(window.location.hostname)) 
          ? crossOrigin 
          : undefined
      }
      onError={() => setHasError(true)}
    />
  );
};
