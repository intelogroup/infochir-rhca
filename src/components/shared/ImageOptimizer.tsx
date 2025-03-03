
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageLoader } from "@/hooks/useImageLoader";
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
  const { isLoading, hasError, imageSrc, setHasError } = useImageLoader({
    src,
    alt,
    width,
    height,
    priority
  });

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
      src={imageSrc}
      alt={alt}
      className={className}
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
};
