import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

// Register Service Worker
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful:', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }
};

// Preload critical images
const preloadImages = () => {
  const images = [
    '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
    '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
    '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png'
  ];

  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Configure React Query for optimal performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      networkMode: 'offlineFirst'
    },
  },
});

// Initialize app with performance monitoring
const initApp = () => {
  console.time('App Mount');
  
  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  console.timeEnd('App Mount');
};

// Start preloading and initialization
registerServiceWorker();
preloadImages();
initApp();

// Report performance metrics
window.addEventListener('load', () => {
  setTimeout(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    console.group('Performance Metrics');
    console.log('First Contentful Paint:', paint.find(p => p.name === 'first-contentful-paint')?.startTime);
    console.log('DOM Interactive:', navigation.domInteractive);
    console.log('DOM Complete:', navigation.domComplete);
    console.log('Load Total:', navigation.loadEventEnd - navigation.startTime);
    console.groupEnd();
  }, 0);
});