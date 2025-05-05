
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

// App with providers
const AppWithProviders = () => (
  <React.Suspense fallback={<LoadingIndicator />}>
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
  </React.Suspense>
);

// Initialize application - ensure the DOM is fully loaded before rendering
const initApp = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    // Clear any existing content
    rootElement.innerHTML = '';
    
    // Add a loading indicator while React initializes
    const loadingElement = document.createElement('div');
    loadingElement.id = 'app-loading';
    rootElement.appendChild(loadingElement);
    
    // Create React root and render the app
    const root = ReactDOM.createRoot(rootElement);
    
    // Render with React.StrictMode only in development
    if (process.env.NODE_ENV === 'development') {
      root.render(
        <React.StrictMode>
          <AppWithProviders />
        </React.StrictMode>
      );
    } else {
      root.render(<AppWithProviders />);
    }
  }
};

// Initialize immediately (modern browsers)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Register the service worker - moved to after app initialization for better performance
if ('serviceWorker' in navigator && !isDebugMode) {
  window.addEventListener('load', () => {
    // Delay service worker registration to improve initial page load
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        if (isDebugMode) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }
      }).catch(error => {
        if (isDebugMode) {
          console.error('ServiceWorker registration failed: ', error);
        }
      });
    }, 3000); // 3 second delay
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
