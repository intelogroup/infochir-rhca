
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageFallback } from "./ImageFallback";

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
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (isLoading) {
    return <Skeleton className={`${className} bg-muted`} style={{ width, height }} />;
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
      src={src}
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
