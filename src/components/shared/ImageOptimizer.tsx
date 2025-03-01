
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

interface ImageOptimizerProps {
  src: string | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackText?: string;
}

export const ImageOptimizer = ({ 
  src, 
  alt, 
  className = "", 
  width = 400,
  height = 300,
  fallbackText
}: ImageOptimizerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    
    if (!src) {
      console.warn(`[ImageOptimizer:WARN] No source URL provided for image: ${alt}`);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    console.log(`[ImageOptimizer:INFO] Loading image from: ${src}, alt: ${alt}`);

    const loadImage = () => {
      const img = new Image();
      
      // Add quality and resize parameters to the URL if it's an Unsplash image
      if (src.includes('unsplash.com')) {
        const optimizedSrc = `${src}&q=75&w=${width}&fit=crop`;
        console.log(`[ImageOptimizer:DEBUG] Using optimized Unsplash URL: ${optimizedSrc}`);
        img.src = optimizedSrc;
        setImageSrc(optimizedSrc);
      } 
      // Handle Supabase storage URLs for RHCA covers
      else if (src.includes('supabase.co') || src.includes('llxzstqejdrplmxdjxlu')) {
        // Check if this is an RHCA cover image
        const isRHCACover = src.includes('rhca_covers') || 
                          src.includes('rhca-covers') || 
                          src.includes('RHCA_vol_');
        
        if (isRHCACover) {
          console.log(`[ImageOptimizer:DEBUG] Loading RHCA cover image: ${src}`);
          // Add cache-busting parameter to ensure fresh image load
          const cacheBuster = `?t=${Date.now()}`;
          const cacheBustedSrc = `${src}${cacheBuster}`;
          console.log(`[ImageOptimizer:DEBUG] Using cache-busted URL: ${cacheBustedSrc}`);
          img.src = cacheBustedSrc;
          setImageSrc(cacheBustedSrc);
        } else {
          img.src = src;
          setImageSrc(src);
        }
      } 
      else {
        console.log(`[ImageOptimizer:DEBUG] Loading standard image: ${src}`);
        img.src = src;
        setImageSrc(src);
      }

      img.onload = () => {
        console.log(`[ImageOptimizer:SUCCESS] Image loaded successfully: ${src}`);
        setIsLoading(false);
        setHasError(false);
      };

      img.onerror = (error) => {
        console.error(`[ImageOptimizer:ERROR] Failed to load image from: ${src}`, error);
        
        // If we've already retried 3 times, give up
        if (retryCount >= 2) {
          setHasError(true);
          setIsLoading(false);
          return;
        }
        
        // If this is an RHCA cover, try to see if the file exists with a slightly different name
        if (src.includes('RHCA_vol_')) {
          const urlParts = src.split('/');
          const filename = urlParts[urlParts.length - 1];
          
          // Try with and without date format
          if (filename.match(/RHCA_vol_\d+_no_\d+_\d+_\d+_\d+/)) {
            // Has date format, try without date
            const baseFilename = filename.replace(/(_\d+_\d+_\d+)\.png.*/, '.png');
            const newSrc = src.replace(filename, baseFilename);
            console.log(`[ImageOptimizer:DEBUG] Retrying with simplified filename: ${newSrc}`);
            
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              const newImg = new Image();
              newImg.src = newSrc;
              setImageSrc(newSrc);
            }, 500);
          } else {
            setHasError(true);
            setIsLoading(false);
          }
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      };
    };

    loadImage();

    return () => {
      // Clean up
    };
  }, [src, width, alt, retryCount]);

  if (isLoading) {
    return <Skeleton className={`${className} bg-muted`} style={{ width, height }} />;
  }

  if (hasError || !src) {
    console.log(`[ImageOptimizer:INFO] Showing fallback for failed image: ${alt}`);
    return (
      <div 
        className={`${className} flex items-center justify-center bg-emerald-50/50 border border-emerald-100/50 rounded-lg`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <div className="flex flex-col items-center text-emerald-600/50">
          <FileText className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">{fallbackText || "Image non disponible"}</span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      onError={(e) => {
        console.error(`[ImageOptimizer:ERROR] Runtime error loading image: ${src}`, e);
        setHasError(true);
      }}
    />
  );
};
