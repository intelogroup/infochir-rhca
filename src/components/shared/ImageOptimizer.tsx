import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const ImageOptimizer = ({ 
  src, 
  alt, 
  className = "", 
  width = 400,
  height = 300 
}: ImageOptimizerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const img = new Image();
    
    // Add quality and resize parameters to the URL if it's an Unsplash image
    if (src.includes('unsplash.com')) {
      const optimizedSrc = `${src}&q=75&w=${width}&fit=crop`;
      img.src = optimizedSrc;
      setImageSrc(optimizedSrc);
    } else {
      img.src = src;
      setImageSrc(src);
    }

    img.onload = () => {
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
    };
  }, [src, width]);

  if (isLoading) {
    return <Skeleton className={`${className} bg-muted`} style={{ width, height }} />;
  }

  return (
    <img 
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
    />
  );
};