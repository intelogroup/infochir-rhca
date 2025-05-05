
import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { WelcomeModal } from "./components/welcome/WelcomeModal";
import { ProductInfoModal } from "./components/welcome/ProductInfoModal";

// Set up in production mode or preview mode
const isDebugMode = process.env.NODE_ENV === 'development' || 
                   process.env.VITE_APP_PREVIEW === 'true' ||
                   process.env.DEBUG === 'true';

// Preload critical images
const preloadCriticalImages = () => {
  // These images should be preloaded with high priority
  const criticalImages = [
    '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
    '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
    '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png'
  ];
  
  // Preload secondary images with lower priority
  const secondaryImages = [
    // Add secondary images here
  ];
  
  // Create Image objects to force preload
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
    img.fetchPriority = 'high';
    img.onload = () => console.log(`Preloaded critical image: ${src}`);
  });
  
  // Load secondary images with lower priority
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      secondaryImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.fetchPriority = 'low';
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      secondaryImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, 200);
  }
};

// Pre-initialize critical resources before mounting React
const preFetchResources = async () => {
  try {
    // Prefetch critical data
    queryClient.prefetchQuery({
      queryKey: ['criticalData'],
      queryFn: () => Promise.resolve(true),
      staleTime: Infinity
    });
    
    // Preload critical images immediately
    preloadCriticalImages();
    
    return true;
  } catch (err) {
    console.error('Error prefetching resources:', err);
    return false;
  }
};

// App with providers (memoized for performance)
const AppWithProviders = React.memo(() => (
  <React.StrictMode>
    <ErrorBoundary name="AppRoot">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <WelcomeModal />
          <ProductInfoModal />
          <Toaster richColors position="top-center" closeButton />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
));

// Initialize application with performance optimizations
const initApp = async () => {
  performance.mark('app-init');
  
  const rootElement = document.getElementById("root");
  if (!rootElement) return;
  
  // Start prefetching in parallel with React initialization
  preFetchResources().catch(console.error);
  
  // Create React root and render immediately
  const root = ReactDOM.createRoot(rootElement);
  
  // Render the app without delay
  root.render(<AppWithProviders />);
  
  // Hide the initial loader once React has rendered
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
    
    // If the app is still not fully loaded after 10 seconds, show refresh button
    const refreshTimeout = setTimeout(() => {
      const appRoot = document.getElementById('root');
      const appLoaded = appRoot && appRoot.childElementCount > 0;
      
      if (!appLoaded) {
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Page bloquée? Cliquez pour rafraîchir';
        refreshButton.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:10px 15px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;';
        refreshButton.onclick = () => window.location.reload();
        document.body.appendChild(refreshButton);
      }
    }, 10000);
    
    // Clear the timeout if the app loads successfully
    window.addEventListener('app-loaded', () => {
      clearTimeout(refreshTimeout);
      
      // Log performance metrics
      if (performance.getEntriesByType) {
        const perfEntries = performance.getEntriesByType('measure');
        console.log('Performance metrics:', perfEntries);
      }
    });
  });
}
