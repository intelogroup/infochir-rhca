
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageLoader } from "@/hooks/useImageLoader";
import { ImageFallback } from "./ImageFallback";
import { useImageContext } from "@/contexts/ImageContext";

interface ImageOptimizerProps {
  src: string | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackText?: string;
  priority?: boolean;
}

export const ImageOptimizer = React.memo(({ 
  src, 
  alt, 
  className = "", 
  width = 400,
  height = 300,
  fallbackText,
  priority = false
}: ImageOptimizerProps) => {
  const { isLoading, hasError, imageSrc, setHasError } = useImageLoader({
    src,
    alt,
    width,
    height,
    priority
  });
  
  const imageContext = useImageContext();
  
  // Preload critical images right away
  React.useEffect(() => {
    if (priority && imageSrc) {
      imageContext.preloadImage(imageSrc, true);
    }
  }, [priority, imageSrc, imageContext]);

  if (isLoading) {
    return (
      <div className="relative" style={{ width, height }}>
        <Skeleton 
          className={`${className} bg-muted absolute inset-0`} 
          style={{ width, height }} 
        />
        {/* Low-quality image placeholder if available */}
        {src && (
          <img 
            src={`${src}?w=40&h=30&q=10&blur=10`}
            alt=""
            className={`${className} absolute inset-0 opacity-40 filter blur-sm`}
            width={width}
            height={height}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }

  if (hasError || !src) {
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
      src={imageSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300`}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      onError={(e) => {
        console.error(`[ImageOptimizer:ERROR] Runtime error loading image: ${src}`, e);
        setHasError(true);
      }}
    />
  );
});

ImageOptimizer.displayName = 'ImageOptimizer';
