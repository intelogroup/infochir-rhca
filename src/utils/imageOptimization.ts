
/**
 * Utility function for image optimization
 */
export const getOptimizedImageUrl = (src: string | undefined, width: number, height: number): string => {
  if (!src) return '';
  
  // Handle Supabase storage URLs
  if (src.includes('supabase.co') || src.includes('llxzstqejdrplmxdjxlu')) {
    // Remove any existing width/height params to avoid duplicates
    const baseUrl = src.split('?')[0];
    return `${baseUrl}?width=${width}&height=${height}`;
  }
  
  return src;
};

/**
 * Get alternative URL for RHCA covers by trying multiple filename patterns
 */
export const getAlternativeRHCAUrl = (src: string): string | null => {
  // If URL doesn't contain RHCA pattern, return null
  if (!src.includes('RHCA_vol_') && !src.includes('rhca_covers') && !src.includes('rhca-covers')) return null;
  
  const variations = [];
  
  // Original format without date portion
  if (src.includes('_vol_')) {
    // Extract the vol and issue numbers
    const volMatch = src.match(/vol_(\d+)/i);
    const issueMatch = src.match(/no_(\d+)/i);
    
    if (volMatch && issueMatch) {
      const vol = volMatch[1].padStart(2, '0');
      const issue = issueMatch[1].padStart(2, '0');
      
      // Try different date formats and separators
      variations.push(`RHCA_vol_${vol}_no_${issue}.png`);
      variations.push(`RHCA_vol_${vol}_no_${issue}.jpg`);
      
      // Try with different casing
      variations.push(`rhca_vol_${vol}_no_${issue}.png`);
      variations.push(`rhca_vol_${vol}_no_${issue}.jpg`);
    }
  }
  
  // Try removing any date portions (common pattern in filenames)
  variations.push(src.replace(/(_\d+_\d+_\d+)\.png.*/, '.png'));
  variations.push(src.replace(/(_\d+_\d+_\d+)\.jpg.*/, '.jpg'));
  
  // Try changing the extension from png to jpg and vice versa
  if (src.endsWith('.png') || src.includes('.png?')) {
    variations.push(src.replace('.png', '.jpg'));
  } else if (src.endsWith('.jpg') || src.includes('.jpg?')) {
    variations.push(src.replace('.jpg', '.png'));
  }
  
  // Try standard formats with different bucket names
  if (src.includes('rhca_covers')) {
    variations.push(src.replace('rhca_covers', 'rhca-covers'));
  } else if (src.includes('rhca-covers')) {
    variations.push(src.replace('rhca-covers', 'rhca_covers'));
  }
  
  // Try raw filename in different buckets
  const filename = src.split('/').pop()?.split('?')[0];
  if (filename) {
    if (!variations.includes(`https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/${filename}`)) {
      variations.push(`https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/${filename}`);
    }
    if (!variations.includes(`https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-covers/${filename}`)) {
      variations.push(`https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-covers/${filename}`);
    }
  }
  
  // Return the first alternative or null if no variations were generated
  return variations.length > 0 ? variations[0] : null;
};

/**
 * Utility to extract bucket name from a Supabase storage URL
 */
export const extractBucketName = (url: string): string | null => {
  if (!url.includes('supabase.co/storage/v1/object/public/')) return null;
  
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)/);
  return match ? match[1] : null;
};

/**
 * Utility to extract filename from a Supabase storage URL
 */
export const extractFilename = (url: string): string | null => {
  if (!url) return null;
  
  // Remove query params
  const baseUrl = url.split('?')[0];
  
  // Get everything after the last slash
  const parts = baseUrl.split('/');
  return parts.length > 0 ? parts[parts.length - 1] : null;
};
