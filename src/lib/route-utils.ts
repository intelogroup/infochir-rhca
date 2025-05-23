
/**
 * Utility functions for route management and preloading
 */

// Preload a route to improve performance
export const preloadRoute = (path: string): void => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.as = 'document';
  
  // Check if this link already exists
  if (!document.head.querySelector(`link[rel="prefetch"][href="${path}"]`)) {
    document.head.appendChild(link);
  }
};

// Preload common routes for better performance
export const preloadCommonRoutes = (): void => {
  const commonRoutes = ['/', '/about', '/rhca', '/igm', '/index-medicus', '/submission'];
  commonRoutes.forEach(route => preloadRoute(route));
};

// Handle route change
export const handleRouteChange = (path: string): void => {
  console.info(`Route changed to: ${path}`);
  
  // Signal that route change is complete
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('route-changed'));
  }
  
  // Context-specific route preloading
  if (path === '/') {
    // From Home, users often go to About, RHCA or IGM
    preloadRoute('/about');
    preloadRoute('/rhca');
    preloadRoute('/igm');
  } else if (path === '/rhca') {
    // From RHCA, users often go to article details
    preloadRoute('/rhca/article');
  } else if (path === '/igm') {
    // From IGM, users often go to details or directives
    preloadRoute('/igm/directives');
  }
};
