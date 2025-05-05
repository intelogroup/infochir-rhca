
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { optimizeImageUrl } from "@/utils/imageLoader";

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
  
  // Get optimized image URL
  const optimizedSrc = React.useMemo(() => {
    if (!src) return "";
    return optimizeImageUrl(src, { 
      width, 
      height, 
      priority,
      format: 'webp'
    });
  }, [src, width, height, priority]);
  
  // Use intersection observer for non-priority images
  React.useEffect(() => {
    if (!src || priority) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && imgRef.current) {
          // Set data-src to actual src when in viewport
          if (imgRef.current.dataset.src) {
            imgRef.current.src = imgRef.current.dataset.src;
          }
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Load images 200px before they appear in viewport
        threshold: 0.01
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [optimizedSrc, priority, src]);

  // Handle image errors gracefully
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

  // If image failed to load, show a placeholder
  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-100 flex items-center justify-center`} 
        style={dimensionStyle}
        aria-label={`Image ${alt} not available`}
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
        src={priority ? optimizedSrc : undefined}
        data-src={!priority ? optimizedSrc : undefined}
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
