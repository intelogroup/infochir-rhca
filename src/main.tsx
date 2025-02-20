
import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { BrowserRouter } from "react-router-dom";

// Browser compatibility detection
const browserCompatibilityCheck = () => {
  const isModernBrowser = (
    'fetch' in window &&
    'Promise' in window &&
    'assign' in Object &&
    'Map' in window
  );

  if (!isModernBrowser) {
    console.warn('[Browser Compatibility] Some features may not work in this browser');
  }

  return isModernBrowser;
};

// Initialize application with compatibility checks
const initializeApp = async () => {
  console.log("[main] Initializing application");

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("[main] Root element not found");
    throw new Error('Root element not found');
  }

  // Check browser compatibility
  const isModernBrowser = browserCompatibilityCheck();

  // Create root with fallback for older browsers
  const root = ReactDOM.createRoot(rootElement);

  // Render app with compatibility warning if needed
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        {!isModernBrowser && (
          <div className="bg-yellow-50 p-4 text-yellow-800 text-sm rounded-md mb-4">
            Your browser may not support all features. Please consider updating to a modern browser for the best experience.
          </div>
        )}
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Handle initialization errors
try {
  initializeApp();
} catch (error) {
  console.error('[Initialization Error]', error);
  // Display error message in DOM
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Application Error</h1>
        <p>We're sorry, but something went wrong. Please try reloading the page.</p>
      </div>
    `;
  }
}
