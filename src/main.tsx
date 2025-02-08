
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";

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

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
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
