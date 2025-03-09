
/**
 * Utility function for image optimization
 */
export const getOptimizedImageUrl = (src: string | undefined, width: number, height: number): string => {
  if (!src) return '';
  
  // Handle Supabase storage URLs
  if (src.includes('supabase.co') || src.includes('llxzstqejdrplmxdjxlu')) {
    const sizeParams = src.includes('?') ? `&width=${width}&height=${height}` : `?width=${width}&height=${height}`;
    return `${src}${sizeParams}`;
  }
  
  return src;
};

/**
 * Get alternative URL for RHCA covers
 */
export const getAlternativeRHCAUrl = (src: string): string | null => {
  if (!src.includes('RHCA_vol_')) return null;
  const baseFilename = src.replace(/(_\d+_\d+_\d+)\.png.*/, '.png');
  return baseFilename;
};
