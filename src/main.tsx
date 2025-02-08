
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

console.info("[App] Initializing with React Router and Query Client");

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <App />
          <Toaster />
        </ErrorBoundary>
      </QueryClientProvider>
    </React.StrictMode>
  </BrowserRouter>
);

// Only log performance metrics in development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    const timing = performance.timing;
    const interactive = timing.domInteractive - timing.navigationStart;
    const complete = timing.domComplete - timing.navigationStart;
    const total = timing.loadEventEnd - timing.navigationStart;

    console.info('Performance Metrics', {
      'DOM Interactive': `${interactive}ms`,
      'DOM Complete': `${complete}ms`,
      'Load Total': `${total}ms`
    });
  });
}
