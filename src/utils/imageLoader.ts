
/**
 * Image optimization utility functions
 */

// Default quality settings
const DEFAULT_QUALITY = 75;
const HIGH_QUALITY = 90;
const LOW_QUALITY = 60;

// Cache for already optimized URLs to avoid recalculation
const optimizedUrlCache = new Map<string, string>();

/**
 * Optimize image URL by adding width, height, quality and format parameters
 */
export const optimizeImageUrl = (
  src: string, 
  { 
    width,
    height,
    quality,
    format = 'webp',
    priority = false
  }: {
    width?: number,
    height?: number,
    quality?: number,
    format?: 'webp' | 'jpeg' | 'png' | 'auto',
    priority?: boolean
  } = {}
): string => {
  if (!src) return src;
  
  // Skip optimization for data URLs, SVGs, or already optimized URLs
  if (src.startsWith('data:') || 
      src.endsWith('.svg') || 
      src.includes('?w=') && src.includes('&q=')) {
    return src;
  }
  
  // Check cache first
  const cacheKey = `${src}-${width}-${height}-${quality}-${format}-${priority}`;
  if (optimizedUrlCache.has(cacheKey)) {
    return optimizedUrlCache.get(cacheKey)!;
  }
  
  // Mobile devices get lower quality images by default to save bandwidth
  const isMobile = typeof window !== 'undefined' && 
                  window.navigator && 
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Determine quality based on priority, device type, and custom quality setting
  const imageQuality = quality ?? 
                      (priority ? HIGH_QUALITY : 
                      (isMobile ? LOW_QUALITY : DEFAULT_QUALITY));
  
  try {
    // Create URL object to work with query parameters
    const url = new URL(src, window.location.origin);
    
    // Add optimization parameters
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    
    // Set quality
    url.searchParams.set('q', imageQuality.toString());
    
    // Set format if not SVG
    if (!src.endsWith('.svg') && format !== 'auto') {
      url.searchParams.set('fmt', format);
    }
    
    // Add cache control for better caching
    if (!url.searchParams.has('t')) {
      // Add a cache-busting timestamp that changes weekly
      const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
      url.searchParams.set('t', weekNumber.toString());
    }
    
    const optimizedUrl = url.toString();
    optimizedUrlCache.set(cacheKey, optimizedUrl);
    return optimizedUrl;
  } catch (e) {
    // Fall back to simple parameter addition for relative URLs
    const separator = src.includes('?') ? '&' : '?';
    let params = [];
    
    if (width) params.push(`w=${width}`);
    if (height) params.push(`h=${height}`);
    params.push(`q=${imageQuality}`);
    
    if (!src.endsWith('.svg') && format !== 'auto') {
      params.push(`fmt=${format}`);
    }
    
    // Add cache control
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    params.push(`t=${weekNumber}`);
    
    const optimizedUrl = src + (params.length ? separator + params.join('&') : '');
    optimizedUrlCache.set(cacheKey, optimizedUrl);
    return optimizedUrl;
  }
};

/**
 * Generate alternative RHCA cover URLs based on different patterns
 */
export const getAlternativeRHCAUrl = (src: string): string | null => {
  if (!src) return null;
  
  // Extract volume and issue from URL if possible
  const match = src.match(/RHCA_vol_(\d+)_no_(\d+)/i);
  if (!match) return null;
  
  let vol = match[1];
  let issue = match[2];
  
  // Try alternative URL formats
  if (src.includes('rhca_covers')) {
    // Switch to rhca-covers
    return src.replace('rhca_covers', 'rhca-covers');
  } else if (src.includes('rhca-covers')) {
    // Switch to rhca_covers
    return src.replace('rhca-covers', 'rhca_covers');
  }
  
  // Try with padded zeros in volume/issue
  if (/vol_\d$/.test(src)) {
    // Single digit volume, try padded
    return src.replace(/vol_(\d)/, 'vol_0$1');
  }
  
  // Try with different file extension
  if (src.endsWith('.jpg')) {
    return src.replace('.jpg', '.png');
  } else if (src.endsWith('.png')) {
    return src.replace('.png', '.jpg');
  }
  
  return null;
};

/**
 * Extract bucket name from a Supabase URL
 */
export const extractBucketName = (url: string): string | null => {
  if (!url) return null;
  
  const match = url.match(/\/public\/([^\/]+)\//);
  return match ? match[1] : null;
};

/**
 * Extract filename from URL
 */
export const extractFilename = (url: string): string | null => {
  if (!url) return null;
  
  // Remove query parameters
  const urlWithoutQuery = url.split('?')[0];
  
  // Get the last part of the path
  const parts = urlWithoutQuery.split('/');
  return parts[parts.length - 1] || null;
};

/**
 * Preload multiple images with specified priorities
 */
export const preloadImages = (images: Array<{src: string, priority?: 'high' | 'low' | 'auto'}>) => {
  if (typeof window === 'undefined') return;
  
  // Sort by priority (high first)
  const sortedImages = [...images].sort((a, b) => {
    const priorityMap = { high: 0, auto: 1, low: 2 };
    return priorityMap[a.priority || 'auto'] - priorityMap[b.priority || 'auto'];
  });
  
  // Preload high priority images immediately
  const highPriorityImages = sortedImages.filter(img => img.priority === 'high');
  highPriorityImages.forEach(img => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = img.src;
    preloadLink.fetchPriority = 'high';
    document.head.appendChild(preloadLink);
  });
  
  // Preload other images during idle time
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      const otherImages = sortedImages.filter(img => img.priority !== 'high');
      otherImages.forEach(img => {
        const imgEl = new Image();
        imgEl.src = img.src;
        imgEl.fetchPriority = img.priority || 'auto';
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      const otherImages = sortedImages.filter(img => img.priority !== 'high');
      otherImages.forEach(img => {
        const imgEl = new Image();
        imgEl.src = img.src;
      });
    }, 300);
  }
};

/**
 * Get optimized image URL specifically for RHCA covers
 */
export const getOptimizedRHCACoverUrl = (vol: string, issue: string, options = {}) => {
  // Pad volume and issue numbers with zeros if needed
  const paddedVol = vol.padStart(2, '0');
  const paddedIssue = issue.padStart(2, '0');
  
  // Try both bucket naming conventions
  const urls = [
    `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_${paddedVol}_no_${paddedIssue}.png`,
    `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-covers/RHCA_vol_${paddedVol}_no_${paddedIssue}.png`
  ];
  
  // Return the optimized version of the first URL
  // The component will try the alternative if the first one fails
  return optimizeImageUrl(urls[0], options);
};
