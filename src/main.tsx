
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

// Create a loading indicator to show while the app initializes
const LoadingIndicator = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(to bottom, #f8fafc, #ffffff)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        margin: '0 auto 20px auto',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ fontFamily: 'sans-serif', color: '#666' }}>Chargement de l'application...</p>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Preload critical images
const preloadCriticalImages = () => {
  const criticalImages = [
    '/lovable-uploads/75589792-dc14-4d53-9aae-5796c76a3b39.png',
    '/lovable-uploads/4e3c1f79-c9cc-4d01-8520-1af84d350a2a.png',
    '/lovable-uploads/745435b6-9abc-4051-b168-cf77c96ed9a0.png'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
    
    // Also create an actual image to load it
    const img = new Image();
    img.src = src;
  });
};

// Pre-initialize critical resources before mounting React
const preFetchResources = async () => {
  try {
    // Prefetch critical data
    await queryClient.prefetchQuery({
      queryKey: ['criticalData'],
      queryFn: () => Promise.resolve(true),
      staleTime: Infinity
    });
    
    // Preload critical images
    preloadCriticalImages();
    
    return true;
  } catch (err) {
    console.error('Error prefetching resources:', err);
    return false;
  }
};

// App with providers
const AppWithProviders = () => (
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
);

// Initialize application synchronously to prevent flashing
const initApp = async () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;
  
  // Clear any existing content
  rootElement.innerHTML = '';
  
  // Show loading indicator instantly
  const loadingContainer = document.createElement('div');
  loadingContainer.id = 'app-loading';
  loadingContainer.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:linear-gradient(to bottom,#f8fafc,#ffffff)">
      <div style="text-align:center">
        <div style="border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;width:40px;height:40px;margin:0 auto 20px auto;animation:spin 1s linear infinite"></div>
        <p style="font-family:sans-serif;color:#666">Chargement de l'application...</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  rootElement.appendChild(loadingContainer);
  
  // Pre-fetch critical resources in parallel with React initialization
  preFetchResources().catch(console.error);
  
  // Create React root
  const root = ReactDOM.createRoot(rootElement);
  
  // Render the app without delay
  root.render(<AppWithProviders />);
  
  // Remove the loading indicator once React has rendered
  const appLoadingElement = document.getElementById('app-loading');
  if (appLoadingElement) {
    appLoadingElement.style.display = 'none';
  }
};

// Initialize immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Register the service worker after app is initialized and stable
if ('serviceWorker' in navigator && !isDebugMode) {
  window.addEventListener('load', () => {
    // Register service worker immediately
    navigator.serviceWorker.register('/sw.js').then(registration => {
      if (isDebugMode) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }
    }).catch(error => {
      if (isDebugMode) {
        console.error('ServiceWorker registration failed: ', error);
      }
    });
  });
}

// Add a utility to force refresh the page if it's stuck
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // If page is taking too long, provide a way to refresh
    const refreshTimeout = setTimeout(() => {
      // If the app is still not fully loaded after 10 seconds, show refresh button
      const appRoot = document.getElementById('root');
      const appLoaded = appRoot && appRoot.childElementCount > 0 && !document.getElementById('app-loading');
      
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
    });
  });
}
