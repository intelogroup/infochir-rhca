
/**
 * Image optimization utility functions
 */

// Default quality settings
const DEFAULT_QUALITY = 75;
const HIGH_QUALITY = 85;

/**
 * Optimize image URL by adding width, height, quality and format parameters
 */
export const optimizeImageUrl = (
  src: string, 
  { 
    width,
    height,
    quality = DEFAULT_QUALITY,
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
  
  // Skip optimization for data URLs or SVGs
  if (src.startsWith('data:') || src.endsWith('.svg')) return src;
  
  try {
    // Create URL object to work with query parameters
    const url = new URL(src, window.location.origin);
    
    // Add optimization parameters
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    
    // Set quality based on priority
    url.searchParams.set('q', (priority ? HIGH_QUALITY : quality).toString());
    
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
    
    return url.toString();
  } catch (e) {
    // Fall back to simple parameter addition for relative URLs
    const separator = src.includes('?') ? '&' : '?';
    let params = [];
    
    if (width) params.push(`w=${width}`);
    if (height) params.push(`h=${height}`);
    params.push(`q=${priority ? HIGH_QUALITY : quality}`);
    
    if (!src.endsWith('.svg') && format !== 'auto') {
      params.push(`fmt=${format}`);
    }
    
    // Add cache control
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    params.push(`t=${weekNumber}`);
    
    return src + (params.length ? separator + params.join('&') : '');
  }
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
