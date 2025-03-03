
/**
 * Utility functions for image optimization and loading
 */

type ImageSource = {
  src: string;
  width: number;
  height: number;
};

/**
 * Generate an optimized image URL based on the source type and dimensions
 */
export const getOptimizedImageUrl = (src: string | undefined, width: number, height: number): string => {
  if (!src) return '';

  console.log(`[ImageOptimizer:DEBUG] Optimizing image: ${src}`);
  
  // Handle Unsplash images
  if (src.includes('unsplash.com')) {
    const optimizedSrc = `${src}&q=75&w=${width}&h=${height}&fit=crop`;
    console.log(`[ImageOptimizer:DEBUG] Using optimized Unsplash URL: ${optimizedSrc}`);
    return optimizedSrc;
  } 
  
  // Handle Supabase storage URLs for RHCA covers
  if (src.includes('supabase.co') || src.includes('llxzstqejdrplmxdjxlu')) {
    // Check if this is an RHCA cover image
    const isRHCACover = src.includes('rhca_covers') || 
                      src.includes('rhca-covers') || 
                      src.includes('RHCA_vol_');
    
    if (isRHCACover) {
      console.log(`[ImageOptimizer:DEBUG] Loading RHCA cover image: ${src}`);
      // Add size parameters and cache-busting parameter
      const cacheBuster = `?t=${Date.now()}`;
      const sizeParams = `&width=${width}&height=${height}`;
      return `${src}${cacheBuster}${sizeParams}`;
    } 
    
    // Add size parameters but no cache busting for other Supabase images
    const sizeParams = src.includes('?') ? `&width=${width}&height=${height}` : `?width=${width}&height=${height}`;
    return `${src}${sizeParams}`;
  }
  
  // Standard images - try to add size parameters
  const sizeParams = src.includes('?') ? `&w=${width}&h=${height}` : `?w=${width}&h=${height}`;
  return `${src}${sizeParams}`;
};

/**
 * Get alternative URL for RHCA covers when the original URL fails
 * This handles different naming conventions for RHCA cover images
 */
export const getAlternativeRHCAUrl = (src: string): string | null => {
  if (!src.includes('RHCA_vol_')) return null;

  const urlParts = src.split('/');
  const filename = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params
  
  // Try with and without date format
  if (filename.match(/RHCA_vol_\d+_no_\d+_\d+_\d+_\d+/)) {
    // Has date format, try without date
    const baseFilename = filename.replace(/(_\d+_\d+_\d+)\.png.*/, '.png');
    const newSrc = src.replace(filename, baseFilename);
    console.log(`[ImageOptimizer:DEBUG] Generated alternative filename without date: ${newSrc}`);
    return newSrc;
  } 
  
  // Try with current date added
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  
  const parts = filename.replace('.png', '').split('_');
  if (parts.length >= 4) {
    const dateFilename = `${parts[0]}_${parts[1]}_${parts[2]}_${parts[3]}_${day}_${month}_${year}.png`;
    const newSrc = src.replace(filename, dateFilename);
    console.log(`[ImageOptimizer:DEBUG] Generated alternative filename with date: ${newSrc}`);
    return newSrc;
  }
  
  return null;
};
