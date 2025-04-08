
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

// Use lazy loading for production to improve initial load time
const AppWithProviders = () => (
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
);

// Initialize application - ensure the DOM is fully loaded before rendering
const initApp = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    // Create a concurrent mode root
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

// Either wait for DOM to be ready or initialize immediately
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
