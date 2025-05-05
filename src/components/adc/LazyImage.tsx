
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

const LazyImage = ({ 
  src, 
  alt, 
  className = "", 
  width, 
  height, 
  priority = false 
}: LazyImageProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  
  // Add width and height parameters for image optimization
  const optimizedSrc = React.useMemo(() => {
    if (!src || !width || !height) return src;
    
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}w=${width}&h=${height}&quality=${priority ? '85' : '75'}&format=webp`;
  }, [src, width, height, priority]);
  
  // Use intersection observer for lazy loading
  React.useEffect(() => {
    // Skip intersection observer for priority images
    if (priority) {
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && imgRef.current) {
          // Set the src attribute when image becomes visible
          imgRef.current.src = optimizedSrc;
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Load 200px before image becomes visible
        threshold: 0.01
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [optimizedSrc, priority]);

  // Handle image load error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.warn(`Failed to load image: ${src}`);
  };

  // Generate dimensions style
  const dimensionStyle = React.useMemo(() => {
    const style: React.CSSProperties = {};
    if (width) style.width = `${width}px`;
    if (height) style.height = `${height}px`;
    return style;
  }, [width, height]);

  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-100 flex items-center justify-center`} 
        style={dimensionStyle}
      >
        <span className="text-gray-400 text-xs">Image indisponible</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <Skeleton 
          className={`${className} ${!isLoading ? 'hidden' : ''}`} 
          style={dimensionStyle} 
        />
      )}
      <img
        ref={imgRef}
        src={priority ? optimizedSrc : (imgRef.current ? optimizedSrc : '')} // Only set src for priority images initially
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{
          ...dimensionStyle,
          objectFit: 'cover',
          transitionProperty: 'opacity',
        }}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        width={width}
        height={height}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </>
  );
};

export default LazyImage;
