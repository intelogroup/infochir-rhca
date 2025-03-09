
import React, { useEffect } from 'react';
import { useImageContext } from '@/contexts/ImageContext';
import { createLogger } from '@/lib/error-logger';

const logger = createLogger('ResourcePreloader');

// This component doesn't render anything visually but preloads critical resources
const ResourcePreloader: React.FC = () => {
  const imageContext = useImageContext();
  
  // Preload critical images when the app starts
  useEffect(() => {
    // List of important images to preload
    const criticalImages = [
      // Hero section images
      '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
      '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
      '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png',
      // Logo
      '/og-image.png',
      // Default fallback images
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&fit=crop'
    ];
    
    logger.log(`Preloading ${criticalImages.length} critical images`);
    
    // Preload all critical images
    criticalImages.forEach(image => {
      if (typeof image === 'string') {
        try {
          imageContext.preloadImage(image, true);
        } catch (error) {
          logger.warn('Error preloading image:', { image, error });
        }
      } else {
        logger.warn('Invalid image URL in preloading', image);
      }
    });
    
    // Add resource hints to document head
    const addResourceHint = (type: 'preload' | 'prefetch' | 'preconnect', href: string, as?: string) => {
      if (typeof href !== 'string') {
        logger.warn(`Invalid href for ${type}:`, href);
        return;
      }
      
      try {
        const link = document.createElement('link');
        link.rel = type;
        link.href = href;
        if (as) link.setAttribute('as', as);
        if (type === 'preconnect') link.setAttribute('crossorigin', '');
        document.head.appendChild(link);
        
        logger.debug(`Added ${type} for: ${href}`);
      } catch (error) {
        logger.warn(`Error adding ${type} for ${href}:`, error);
      }
    };
    
    // Preconnect to important domains
    addResourceHint('preconnect', 'https://fonts.gstatic.com');
    addResourceHint('preconnect', 'https://fonts.googleapis.com');
    addResourceHint('preconnect', 'https://images.unsplash.com');
    
    // Prefetch important routes as strings
    const importantRoutes = ['/rhca', '/adc', '/igm'];
    importantRoutes.forEach(route => {
      // Make sure we're dealing with string routes only
      if (typeof route === 'string') {
        addResourceHint('prefetch', route, 'fetch'); // Using 'fetch' for routes
      }
    });
    
    logger.log('Resource preloading complete');
    
    // Clean up resource hints on unmount (optional - they're lightweight)
    return () => {
      // No cleanup needed for preloaded images - they stay in cache
      logger.debug('ResourcePreloader unmounted');
    };
  }, [imageContext]);
  
  // This component doesn't render anything visible
  return null;
};

export default ResourcePreloader;
