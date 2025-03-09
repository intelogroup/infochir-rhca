
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

// React App component with proper error boundaries and toaster
const AppWithProviders = () => (
  <ErrorBoundary name="AppRoot">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster richColors position="top-center" closeButton />
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

// Initialize application
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppWithProviders />
    </React.StrictMode>
  );
}

// Register the service worker
if ('serviceWorker' in navigator && !isDebugMode) {
  window.addEventListener('load', () => {
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
