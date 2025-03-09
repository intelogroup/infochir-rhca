
import React, { useEffect } from 'react';
import { useImageContext } from '@/contexts/ImageContext';
import { createLogger } from '@/lib/error-logger';

const logger = createLogger('ResourcePreloader');

// This component doesn't render anything visually but preloads critical resources
const ResourcePreloader: React.FC = () => {
  const imageContext = useImageContext();
  
  // Preload critical images when the app starts
  useEffect(() => {
    try {
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
      
      // Preload all critical images with better error handling
      criticalImages.forEach(image => {
        try {
          if (typeof image === 'string' && image) {
            imageContext.preloadImage(image, true);
          } else {
            logger.warn('Invalid image URL in preloading', image);
          }
        } catch (error) {
          logger.warn('Error preloading image:', { image, error });
        }
      });
      
      // Add resource hints to document head in a safer way
      const addResourceHint = (type: 'prefetch' | 'preconnect', href: string) => {
        if (typeof href !== 'string' || !href) {
          logger.warn(`Invalid href for ${type}:`, href);
          return;
        }
        
        if (!document || !document.head) {
          logger.warn(`Document or document.head not available for ${type}:`, href);
          return;
        }
        
        try {
          const link = document.createElement('link');
          link.rel = type;
          link.href = href;
          if (type === 'preconnect') {
            link.setAttribute('crossorigin', '');
          }
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
      
      logger.log('Resource preloading complete');
    } catch (error) {
      logger.error('Error in ResourcePreloader', error);
    }
    
    // Clean up resource hints on unmount (optional - they're lightweight)
    return () => {
      logger.debug('ResourcePreloader unmounted');
    };
  }, [imageContext]);
  
  // This component doesn't render anything visible
  return null;
};

export default ResourcePreloader;
