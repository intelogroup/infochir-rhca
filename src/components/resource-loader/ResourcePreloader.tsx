
import React, { useEffect } from 'react';
import { useImageContext } from '@/contexts/ImageContext';

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
    
    // Preload all critical images
    criticalImages.forEach(image => {
      imageContext.preloadImage(image, true);
    });
    
    // Add resource hints to document head
    const addResourceHint = (type: 'preload' | 'prefetch' | 'preconnect', href: string, as?: string) => {
      const link = document.createElement('link');
      link.rel = type;
      link.href = href;
      if (as) link.setAttribute('as', as);
      if (type === 'preconnect') link.setAttribute('crossorigin', '');
      document.head.appendChild(link);
    };
    
    // Preconnect to important domains
    addResourceHint('preconnect', 'https://fonts.gstatic.com');
    addResourceHint('preconnect', 'https://fonts.googleapis.com');
    addResourceHint('preconnect', 'https://images.unsplash.com');
    
    // Prefetch important routes
    ['/rhca', '/adc', '/igm'].forEach(route => {
      addResourceHint('prefetch', route);
    });
    
    // Clean up resource hints on unmount (optional - they're lightweight)
    return () => {
      // No cleanup needed for preloaded images - they stay in cache
    };
  }, [imageContext]);
  
  // This component doesn't render anything visible
  return null;
};

export default ResourcePreloader;
