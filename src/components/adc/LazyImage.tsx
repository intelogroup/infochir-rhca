
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const LazyImage = ({ src, alt, className = "", width, height }: LazyImageProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Add width and height parameters to the image URL
  const optimizedSrc = (() => {
    if (!src || !width || !height) return src;
    
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}w=${width}&h=${height}&fit=crop`;
  })();

  return (
    <>
      {isLoading && <Skeleton className={className} style={{ width, height }} />}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        width={width}
        height={height}
      />
    </>
  );
};

export default LazyImage;
