
import { useState, useEffect } from 'react';
import Image from 'react-native-fast-image';
import { ImageFallback } from './ImageFallback';

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

  // Reset error state when src changes
  useEffect(() => {
    setError(false);
    setIsLoaded(false);
  }, [src]);

  // If no src or empty string, show fallback immediately
  if (!src || src === "") {
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

  // Handle successful load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle load error
  const handleError = () => {
    setError(true);
    if (onError) onError();
  };

  // Show fallback on error
  if (error) {
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

  // Note: For web we use the img tag, React Native Fast Image is not used in web
  return (
    <img
      src={src}
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
