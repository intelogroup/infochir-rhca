
/**
 * Utility functions for image optimization and loading
 */

/**
 * Generate an optimized image URL based on the source type and dimensions
 */
export const getOptimizedImageUrl = (src: string | undefined, width: number, height: number): string => {
  if (!src) return '';
  
  // Handle Unsplash images
  if (src.includes('unsplash.com')) {
    return `${src}&q=75&w=${width}&h=${height}&fit=crop`;
  } 
  
  // Handle Supabase storage URLs
  if (src.includes('supabase.co') || src.includes('llxzstqejdrplmxdjxlu')) {
    const sizeParams = src.includes('?') ? `&width=${width}&height=${height}` : `?width=${width}&height=${height}`;
    return `${src}${sizeParams}`;
  }
  
  // Standard images
  return src;
};

/**
 * Get alternative URL for RHCA covers when the original URL fails
 */
export const getAlternativeRHCAUrl = (src: string): string | null => {
  if (!src.includes('RHCA_vol_')) return null;

  // Extract base filename without query params
  const urlParts = src.split('/');
  const filename = urlParts[urlParts.length - 1].split('?')[0];
  
  // Try with simplified naming
  const baseFilename = filename.replace(/(_\d+_\d+_\d+)\.png.*/, '.png');
  const newSrc = src.replace(filename, baseFilename);
  
  return newSrc;
};
