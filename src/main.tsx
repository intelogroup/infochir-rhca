
import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

// Enhanced browser compatibility detection
const browserCompatibilityCheck = () => {
  console.log("[Initialization] Starting browser compatibility check");
  
  const requiredFeatures = {
    fetch: 'fetch' in window,
    Promise: 'Promise' in window,
    Object_assign: 'assign' in Object,
    Map: 'Map' in window
  };

  console.log("[Compatibility] Feature detection results:", requiredFeatures);

  const isModernBrowser = Object.values(requiredFeatures).every(Boolean);
  
  if (!isModernBrowser) {
    console.warn('[Compatibility] Browser missing required features:', 
      Object.entries(requiredFeatures)
        .filter(([, supported]) => !supported)
        .map(([feature]) => feature)
    );
  }

  return isModernBrowser;
};

// Enhanced error handling function - doesn't use direct toast
const handleInitializationError = (error: Error) => {
  console.error('[Initialization Error]', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Create error message in DOM instead of using toast
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="color: #991B1B; margin-bottom: 1rem;">Erreur de l'Application</h1>
        <p style="color: #374151; margin-bottom: 1rem;">
          Nous sommes désolés, mais une erreur s'est produite lors du chargement de l'application.
        </p>
        <button onclick="window.location.reload()" 
                style="background: #2563EB; color: white; padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer;">
          Rafraîchir la page
        </button>
      </div>
    `;
  }
};

// React App component with proper error boundaries and toaster
const AppWithProviders = () => {
  const isModernBrowser = browserCompatibilityCheck();
  
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {!isModernBrowser && (
              <div className="bg-yellow-50 p-4 text-yellow-800 text-sm rounded-md mb-4">
                Votre navigateur pourrait ne pas prendre en charge toutes les fonctionnalités. 
                Veuillez le mettre à jour pour une meilleure expérience.
              </div>
            )}
            <App />
            <Toaster richColors position="top-center" />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Initialize application with enhanced logging and error handling
const initializeApp = async () => {
  console.log("[Initialization] Starting application initialization");
  console.time("App Initialization");

  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error('[Critical] Root element not found in DOM');
    }

    console.log("[Initialization] Creating React root");
    const root = ReactDOM.createRoot(rootElement);

    console.log("[Initialization] Rendering application");
    root.render(<AppWithProviders />);

    console.timeEnd("App Initialization");
    console.log("[Initialization] Application successfully mounted");

  } catch (error) {
    console.error('[Critical Initialization Error]', {
      error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    handleInitializationError(error as Error);
  }
};

// Wrap the entire initialization in error boundary
try {
  console.log("[Bootstrap] Starting application bootstrap");
  initializeApp().catch(error => {
    console.error('[Async Initialization Error]', {
      error,
      timestamp: new Date().toISOString()
    });
    handleInitializationError(error as Error);
  });
} catch (error) {
  console.error('[Bootstrap Error]', {
    error,
    timestamp: new Date().toISOString()
  });
  handleInitializationError(error as Error);
}

// Add global error handler for uncaught errors
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('[Uncaught Error]', {
    message: msg,
    url,
    lineNo,
    columnNo,
    error,
    timestamp: new Date().toISOString()
  });
  return false;
};

// Add handler for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('[Unhandled Promise Rejection]', {
    reason: event.reason,
    timestamp: new Date().toISOString()
  });
});
