
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ImageCacheEntry {
  url: string;
  blob?: Blob;
  loaded: boolean;
  error: boolean;
  timestamp: number;
}

interface ImageContextType {
  preloadImage: (url: string, priority?: boolean) => void;
  getImageStatus: (url: string) => { loaded: boolean, error: boolean, blob?: Blob };
  clearCache: () => void;
}

// Create context with default values
const ImageContext = createContext<ImageContextType>({
  preloadImage: () => {},
  getImageStatus: () => ({ loaded: false, error: false }),
  clearCache: () => {},
});

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

// Maximum cache size
const MAX_CACHE_SIZE = 50;

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-memory cache for images
  const [imageCache, setImageCache] = useState<Map<string, ImageCacheEntry>>(new Map());

  // Clean up expired cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const newCache = new Map(imageCache);
      
      // Remove expired entries
      for (const [url, entry] of newCache.entries()) {
        if (now - entry.timestamp > CACHE_EXPIRATION) {
          newCache.delete(url);
        }
      }
      
      // Update cache if changed
      if (newCache.size !== imageCache.size) {
        setImageCache(newCache);
      }
    }, 5 * 60 * 1000); // Run cleanup every 5 minutes
    
    return () => clearInterval(cleanupInterval);
  }, [imageCache]);

  // Check if URL is already in cache and valid
  const isInCache = (url: string): boolean => {
    if (!url) return false;
    
    const entry = imageCache.get(url);
    if (!entry) return false;
    
    const now = Date.now();
    return now - entry.timestamp < CACHE_EXPIRATION;
  };

  // Preload an image and store in cache
  const preloadImage = (url: string, priority = false) => {
    if (!url || isInCache(url)) return;
    
    // Limit cache size by removing oldest entries if needed
    if (imageCache.size >= MAX_CACHE_SIZE) {
      const entries = Array.from(imageCache.entries());
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      // Remove oldest entry
      const newCache = new Map(imageCache);
      newCache.delete(entries[0][0]);
      setImageCache(newCache);
    }
    
    // Create a placeholder in the cache
    setImageCache(prev => {
      const newCache = new Map(prev);
      newCache.set(url, {
        url,
        loaded: false,
        error: false,
        timestamp: Date.now(),
      });
      return newCache;
    });
    
    // Create image element to load the image
    const img = new Image();
    
    if (priority) {
      img.fetchPriority = 'high';
    }
    
    img.onload = () => {
      // Use fetch to get the blob for cache storage
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          setImageCache(prev => {
            const newCache = new Map(prev);
            newCache.set(url, {
              url,
              blob,
              loaded: true,
              error: false,
              timestamp: Date.now(),
            });
            return newCache;
          });
        })
        .catch(() => {
          // If fetch fails but image loaded, still mark as loaded
          setImageCache(prev => {
            const newCache = new Map(prev);
            const currentEntry = newCache.get(url);
            if (currentEntry) {
              newCache.set(url, {
                ...currentEntry,
                loaded: true,
              });
            }
            return newCache;
          });
        });
    };
    
    img.onerror = () => {
      setImageCache(prev => {
        const newCache = new Map(prev);
        newCache.set(url, {
          url,
          loaded: false,
          error: true,
          timestamp: Date.now(),
        });
        return newCache;
      });
    };
    
    img.src = url;
  };

  const getImageStatus = (url: string) => {
    if (!url) {
      return { loaded: false, error: true };
    }
    
    const entry = imageCache.get(url);
    if (!entry) {
      // Start loading if not in cache
      preloadImage(url);
      return { loaded: false, error: false };
    }
    
    return {
      loaded: entry.loaded,
      error: entry.error,
      blob: entry.blob,
    };
  };

  const clearCache = () => {
    setImageCache(new Map());
  };

  const contextValue = {
    preloadImage,
    getImageStatus,
    clearCache,
  };

  return (
    <ImageContext.Provider value={contextValue}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);

export default ImageContext;
