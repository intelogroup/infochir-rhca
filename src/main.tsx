
import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { BrowserRouter } from "react-router-dom";
import { toast } from "sonner";

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

// Enhanced error handling for dependency loading
const handleDependencyError = (error: Error) => {
  console.error('[Dependency Error]', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  toast.error("Une erreur est survenue lors du chargement de l'application", {
    description: "Veuillez rafraîchir la page ou réessayer plus tard."
  });
};

// Initialize application with enhanced logging
const initializeApp = async () => {
  console.log("[Initialization] Starting application initialization");
  console.time("App Initialization");

  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error('[Critical] Root element not found in DOM');
    }

    // Check browser compatibility
    const isModernBrowser = browserCompatibilityCheck();
    console.log("[Initialization] Browser compatibility check complete:", { isModernBrowser });

    // Create root with error tracking
    console.log("[Initialization] Creating React root");
    const root = ReactDOM.createRoot(rootElement);

    // Enhanced initialization logging
    console.log("[Initialization] Setting up React Query client");
    console.log("[Initialization] Preparing to render app");

    // Render app with comprehensive error boundary
    root.render(
      <React.StrictMode>
        <ErrorBoundary fallback={
          <div className="p-4 bg-red-50 border border-red-100 rounded-md m-4">
            <h2 className="text-red-800 text-lg font-semibold mb-2">Une erreur est survenue</h2>
            <p className="text-red-600">Veuillez rafraîchir la page ou réessayer plus tard.</p>
          </div>
        }>
          {!isModernBrowser && (
            <div className="bg-yellow-50 p-4 text-yellow-800 text-sm rounded-md mb-4">
              Votre navigateur pourrait ne pas prendre en charge toutes les fonctionnalités. 
              Veuillez le mettre à jour pour une meilleure expérience.
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

    console.timeEnd("App Initialization");
    console.log("[Initialization] Application successfully mounted");

  } catch (error) {
    console.error('[Critical Initialization Error]', {
      error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    handleDependencyError(error as Error);
    
    // Display error message in DOM
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
    handleDependencyError(error);
  });
} catch (error) {
  console.error('[Bootstrap Error]', {
    error,
    timestamp: new Date().toISOString()
  });
  handleDependencyError(error as Error);
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
