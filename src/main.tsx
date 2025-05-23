import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

// Set up in production mode or preview mode
const isDebugMode = process.env.NODE_ENV === 'development' || 
                   process.env.VITE_APP_PREVIEW === 'true' ||
                   process.env.DEBUG === 'true';

// Preload critical images but don't block rendering
const preloadCriticalImages = () => {
  if (typeof window === 'undefined') return;
  
  // These images should be preloaded with high priority
  const criticalImages = [
    '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
    '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
    '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png'
  ];
  
  // Use requestIdleCallback to avoid blocking the main thread
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.fetchPriority = 'high';
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, 200);
  }
};

// Pre-initialize critical resources asynchronously
const preFetchResources = async () => {
  try {
    // Prefetch critical data in parallel
    queryClient.prefetchQuery({
      queryKey: ['criticalData'],
      queryFn: () => Promise.resolve(true),
      staleTime: Infinity
    });
    
    return true;
  } catch (err) {
    console.error('Error prefetching resources:', err);
    return false;
  }
};

// Initialize application with performance optimizations
const initApp = async () => {
  performance.mark('app-init');
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }
  
  // Create React root
  const root = ReactDOM.createRoot(rootElement);
  
  // Start prefetching in parallel but don't wait
  preFetchResources().catch(console.error);
  
  // Preload images in background
  preloadCriticalImages();
  
  // Render the core app with a single router
  root.render(
    <React.StrictMode>
      <ErrorBoundary name="AppRoot">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  // Hide the initial loader after a short delay to ensure React has started rendering
  const initialLoader = document.getElementById('initial-loader');
  if (initialLoader) {
    initialLoader.style.opacity = '0';
    initialLoader.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      initialLoader.style.display = 'none';
    }, 300);
  }
  
  performance.mark('app-render-complete');
  performance.measure('app-render-time', 'app-init', 'app-render-complete');
  
  // Explicitly dispatch app-loaded event after React has rendered
  setTimeout(() => {
    window.dispatchEvent(new Event('app-loaded'));
  }, 200);
};

// Initialize immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Add a utility to force refresh the page if it's stuck
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Remove the initial loader when window is fully loaded
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.style.display = 'none';
    }
    
    // If the app is still not fully loaded after 8 seconds (reduced from 10), show refresh button
    const refreshTimeout = setTimeout(() => {
      const appRoot = document.getElementById('root');
      const appLoaded = appRoot && appRoot.childElementCount > 0;
      
      if (!appLoaded) {
        console.error("App failed to load properly within timeout period");
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Page bloquée? Cliquez pour rafraîchir';
        refreshButton.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:10px 15px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;';
        refreshButton.onclick = () => window.location.reload();
        document.body.appendChild(refreshButton);
      }
    }, 8000);
    
    // Clear the timeout if the app loads successfully
    window.addEventListener('app-loaded', () => {
      clearTimeout(refreshTimeout);
      console.log("App successfully loaded and rendered");
      
      // Log performance metrics
      if (performance.getEntriesByType) {
        const perfEntries = performance.getEntriesByType('measure');
        console.log('Performance metrics:', perfEntries);
      }
    });
  });
}
