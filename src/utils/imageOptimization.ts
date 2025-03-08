/**
 * Utility functions for image optimization and loading
 */

type ImageSource = {
  src: string;
  width: number;
  height: number;
};

// Track image dimensions to avoid unnecessary resizing requests
const imageDimensionsCache = new Map<string, { width: number, height: number }>();

// Define CDN providers for special handling
const CDN_PROVIDERS = {
  UNSPLASH: 'unsplash.com',
  SUPABASE: 'supabase.co',
  SUPABASE_STORAGE: 'llxzstqejdrplmxdjxlu',
};

/**
 * Generate an optimized image URL based on the source type and dimensions
 */
export const getOptimizedImageUrl = (src: string | undefined, width: number, height: number): string => {
  if (!src) return '';

  // Ensure valid dimensions
  const validWidth = Math.max(width, 10);
  const validHeight = Math.max(height, 10);

  // Only log in development to avoid console spam
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ImageOptimizer:DEBUG] Optimizing image: ${src}`);
  }
  
  // Check if we already have this image in cache with same or larger dimensions
  const cacheKey = src.split('?')[0]; // Remove existing query params for cache key
  const cachedDimensions = imageDimensionsCache.get(cacheKey);
  
  if (cachedDimensions) {
    // If cache has larger or equal dimensions, use those to avoid multiple resizes
    if (cachedDimensions.width >= validWidth && cachedDimensions.height >= validHeight) {
      // Keep using the cached dimensions to avoid redundant resizing requests
      return formatUrl(src, cachedDimensions.width, cachedDimensions.height);
    }
    // Otherwise update cache with larger dimensions
    else {
      imageDimensionsCache.set(cacheKey, { width: validWidth, height: validHeight });
    }
  } else {
    // Add to cache
    imageDimensionsCache.set(cacheKey, { width: validWidth, height: validHeight });
  }

  return formatUrl(src, validWidth, validHeight);
};

/**
 * Format the URL with appropriate sizing parameters based on the source
 */
function formatUrl(src: string, width: number, height: number): string {
  // Handle Unsplash images
  if (src.includes(CDN_PROVIDERS.UNSPLASH)) {
    // Unsplash accepts q, w, h, and fit params
    const optimizedSrc = `${src}${src.includes('?') ? '&' : '?'}q=75&w=${width}&h=${height}&fit=crop&auto=compress`;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ImageOptimizer:DEBUG] Using optimized Unsplash URL: ${optimizedSrc}`);
    }
    return optimizedSrc;
  } 
  
  // Handle Supabase storage URLs for RHCA covers
  if (src.includes(CDN_PROVIDERS.SUPABASE) || src.includes(CDN_PROVIDERS.SUPABASE_STORAGE)) {
    // Check if this is an RHCA cover image
    const isRHCACover = src.includes('rhca_covers') || 
                      src.includes('rhca-covers') || 
                      src.includes('RHCA_vol_');
    
    if (isRHCACover) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[ImageOptimizer:DEBUG] Loading RHCA cover image: ${src}`);
      }
      // Add cache busting only in development
      const cacheBuster = process.env.NODE_ENV === 'development' ? 
                          `?t=${Date.now()}` : 
                          (src.includes('?') ? '' : '?t=stable');
      
      const sizeParams = `${src.includes('?') ? '&' : '?'}width=${width}&height=${height}`;
      return `${src}${cacheBuster}${sizeParams}`;
    } 
    
    // Add size parameters but no cache busting for other Supabase images
    const sizeParams = src.includes('?') ? `&width=${width}&height=${height}` : `?width=${width}&height=${height}`;
    return `${src}${sizeParams}`;
  }
  
  // Standard images - try to add size parameters
  try {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('q', '75');
    return url.toString();
  } catch (e) {
    // If URL parsing fails, fall back to string concatenation
    const sizeParams = src.includes('?') ? `&w=${width}&h=${height}&q=75` : `?w=${width}&h=${height}&q=75`;
    return `${src}${sizeParams}`;
  }
}

/**
 * Get alternative URL for RHCA covers when the original URL fails
 * This handles different naming conventions for RHCA cover images
 */
export const getAlternativeRHCAUrl = (src: string): string | null => {
  if (!src || !src.includes('RHCA_vol_')) return null;

  try {
    const url = new URL(src);
    const urlPath = url.pathname;
    const urlParts = urlPath.split('/');
    const filename = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params
    
    // Try with and without date format
    if (filename.match(/RHCA_vol_\d+_no_\d+_\d+_\d+_\d+/)) {
      // Has date format, try without date
      const baseFilename = filename.replace(/(_\d+_\d+_\d+)\.png.*/, '.png');
      url.pathname = urlPath.replace(filename, baseFilename);
      return url.toString();
    } 
    
    // Try with current date added
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    const parts = filename.replace('.png', '').split('_');
    if (parts.length >= 4) {
      const dateFilename = `${parts[0]}_${parts[1]}_${parts[2]}_${parts[3]}_${day}_${month}_${year}.png`;
      url.pathname = urlPath.replace(filename, dateFilename);
      return url.toString();
    }
    
    return null;
  } catch (e) {
    console.error('[ImageOptimizer:ERROR] Error generating alternative URL:', e);
    return null;
  }
};

/**
 * Generate a blurhash placeholder or low-quality image URL
 */
export const getPlaceholderUrl = (src: string | undefined): string => {
  if (!src) return '';
  
  try {
    const url = new URL(src);
    
    // For Unsplash, use their blur feature
    if (url.hostname.includes(CDN_PROVIDERS.UNSPLASH)) {
      url.searchParams.set('w', '20');
      url.searchParams.set('blur', '20');
      return url.toString();
    }
    
    // For other sources, generate a small blurry version
    url.searchParams.set('w', '20');
    url.searchParams.set('q', '10');
    return url.toString();
  } catch (e) {
    // Fall back to appending parameters
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}w=20&q=10`;
  }
};
