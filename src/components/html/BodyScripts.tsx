
import React from 'react';

export const BodyScripts = () => {
  React.useEffect(() => {
    // Monitor page load performance
    const monitorPerformance = () => {
      if (!window.performance || !window.performance.getEntriesByType) return;
      
      // Get timing metrics
      const pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      const domContentLoadedTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
      
      console.log(`Page load: ${pageLoadTime}ms, DOM content loaded: ${domContentLoadedTime}ms`);
      
      // Report to analytics if it's too slow (over 3 seconds)
      if (pageLoadTime > 3000) {
        console.warn('Page load time is too slow:', pageLoadTime);
      }
    };
    
    const handleLoad = () => {
      // Mark load event
      if (window.performance && window.performance.mark) {
        window.performance.mark('page-loaded');
        window.performance.measure('full-page-load', 'app-init-start', 'page-loaded');
      }
      
      // Log performance data
      setTimeout(monitorPerformance, 0);
      
      // Remove initial loader
      const loader = document.getElementById('initial-loader') as HTMLElement;
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 300);
      }
      
      // Remove nav placeholder when real nav is loaded
      setTimeout(() => {
        const navPlaceholder = document.querySelector('.nav-placeholder') as HTMLElement;
        if (navPlaceholder) {
          navPlaceholder.style.display = 'none';
        }
      }, 100);
    };
    
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      
      // Log more details about network errors if possible
      if (event.error && event.error.name === 'NetworkError') {
        console.error('Network error details:', {
          message: event.error.message,
          url: event.error.fileName || event.filename,
          lineNumber: event.error.lineNumber || event.lineno
        });
      }
    };
    
    const handleDOMContentLoaded = () => {
      console.log('DOM loaded successfully at', new Date().toISOString());
      
      // Check for any network issues
      if (!navigator.onLine) {
        console.warn('Page loaded in offline mode - network functionality will be limited');
      }
    };
    
    window.addEventListener('load', handleLoad);
    window.addEventListener('error', handleError);
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    
    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('error', handleError);
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    };
  }, []);
  
  return null;
};
