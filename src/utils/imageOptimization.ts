
/**
 * Utility function for image optimization
 */
export const getOptimizedImageUrl = (src: string | undefined, width: number, height: number): string => {
  if (!src) return '';
  
  try {
    // Handle Supabase storage URLs
    if (src.includes('supabase.co') || src.includes('llxzstqejdrplmxdjxlu')) {
      // Remove any existing width/height params to avoid duplicates
      const baseUrl = src.split('?')[0];
      return `${baseUrl}?width=${width}&height=${height}&quality=80`;
    }
    
    return src;
  } catch (error) {
    console.error('[getOptimizedImageUrl] Error optimizing image URL:', error);
    return src || '';
  }
};

/**
 * Get alternative URL for RHCA covers by trying multiple filename patterns
 */
export const getAlternativeRHCAUrl = (src: string): string | null => {
  try {
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
        variations.push(`RHCA_vol_${vol}_no_${issue}_cover.png`);
        variations.push(`RHCA_vol_${vol}_no_${issue}_cover.jpg`);
        
        // Try with different casing
        variations.push(`rhca_vol_${vol}_no_${issue}.png`);
        variations.push(`rhca_vol_${vol}_no_${issue}.jpg`);
        
        // Try without leading zeros
        if (vol !== volMatch[1] || issue !== issueMatch[1]) {
          variations.push(`RHCA_vol_${parseInt(vol)}_no_${parseInt(issue)}.png`);
          variations.push(`RHCA_vol_${parseInt(vol)}_no_${parseInt(issue)}.jpg`);
        }
        
        // Try with "issue_" prefix instead of "no_"
        variations.push(`RHCA_vol_${vol}_issue_${issue}.png`);
        variations.push(`RHCA_vol_${vol}_issue_${issue}.jpg`);
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
      
      // Try simpler filename formats
      const simpleFilename = filename
        .replace(/RHCA_vol_(\d+)_no_(\d+).*/, 'RHCA_vol_$1_no_$2')
        .replace(/rhca_vol_(\d+)_no_(\d+).*/, 'rhca_vol_$1_no_$2');
      
      if (simpleFilename !== filename) {
        variations.push(`https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/${simpleFilename}.png`);
        variations.push(`https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/${simpleFilename}.jpg`);
      }
    }
    
    // Return the first alternative or null if no variations were generated
    return variations.length > 0 ? variations[0] : null;
  } catch (error) {
    console.error('[getAlternativeRHCAUrl] Error generating alternative URL:', error);
    return null;
  }
};

/**
 * Utility to extract bucket name from a Supabase storage URL
 */
export const extractBucketName = (url: string): string | null => {
  if (!url) return null;
  try {
    if (!url.includes('supabase.co/storage/v1/object/public/')) return null;
    
    const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('[extractBucketName] Error extracting bucket name:', error);
    return null;
  }
};

/**
 * Utility to extract filename from a Supabase storage URL
 */
export const extractFilename = (url: string): string | null => {
  if (!url) return null;
  
  try {
    // Remove query params
    const baseUrl = url.split('?')[0];
    
    // Get everything after the last slash
    const parts = baseUrl.split('/');
    return parts.length > 0 ? parts[parts.length - 1] : null;
  } catch (error) {
    console.error('[extractFilename] Error extracting filename:', error);
    return null;
  }
};

/**
 * Check if a Supabase URL is accessible
 * This can be used to validate URLs before displaying them
 */
export const checkImageAccess = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    return response.ok;
  } catch (error) {
    console.error('[checkImageAccess] Error checking image access:', error);
    return false;
  }
};

/**
 * Robust image URL resolver with multiple fallback strategies
 */
export const getReliableImageUrl = async (
  primaryUrl: string | null | undefined,
  fallbackUrl: string | null | undefined = null,
  bucketName: string = 'rhca_covers'
): Promise<string | null> => {
  if (!primaryUrl && !fallbackUrl) return null;
  
  try {
    // Try primary URL first
    if (primaryUrl) {
      const isAccessible = await checkImageAccess(primaryUrl);
      if (isAccessible) return primaryUrl;
    }
    
    // If primary URL failed, try fallback
    if (fallbackUrl) {
      const isAccessible = await checkImageAccess(fallbackUrl);
      if (isAccessible) return fallbackUrl;
    }
    
    // If both URLs failed, try alternative patterns
    if (primaryUrl) {
      const altUrl = getAlternativeRHCAUrl(primaryUrl);
      if (altUrl) {
        const isAccessible = await checkImageAccess(altUrl);
        if (isAccessible) return altUrl;
      }
    }
    
    // Final fallback: extract filename and try with basic pattern
    const filename = extractFilename(primaryUrl || fallbackUrl || '');
    if (filename) {
      const directUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/${bucketName}/${filename}`;
      const isAccessible = await checkImageAccess(directUrl);
      if (isAccessible) return directUrl;
    }
    
    return null;
  } catch (error) {
    console.error('[getReliableImageUrl] Error resolving image URL:', error);
    return primaryUrl || fallbackUrl || null;
  }
};

// Helper function to get all possible RHCA cover image URLs for a volume and issue
export const getAllPossibleRHCACoverUrls = (volume: string, issue: string): string[] => {
  const possibleUrls = [];
  
  // Ensure volume and issue are padded with leading zeros
  const paddedVol = String(volume).padStart(2, '0');
  const paddedIssue = String(issue).padStart(2, '0');
  
  // Generate variations with both buckets and both image formats
  const buckets = ['rhca_covers', 'rhca-covers'];
  const formats = ['png', 'jpg'];
  const patterns = [
    `RHCA_vol_${paddedVol}_no_${paddedIssue}`,
    `RHCA_vol_${paddedVol}_no_${paddedIssue}_cover`,
    `RHCA_vol_${parseInt(volume)}_no_${parseInt(issue)}`,
    `rhca_vol_${paddedVol}_no_${paddedIssue}`,
    `rhca_vol_${parseInt(volume)}_no_${parseInt(issue)}`
  ];
  
  for (const bucket of buckets) {
    for (const pattern of patterns) {
      for (const format of formats) {
        possibleUrls.push(`https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/${bucket}/${pattern}.${format}`);
      }
    }
  }
  
  return possibleUrls;
};
