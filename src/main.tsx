
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Configure React Query for optimal performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      networkMode: 'offlineFirst'
    },
  },
});

// Initialize app with error boundary and performance monitoring
const initApp = () => {
  console.log('[App] Initializing with React Router and Query Client');
  
  const root = createRoot(document.getElementById("root")!);
  
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// Start initialization
initApp();

// Report performance metrics
window.addEventListener('load', () => {
  setTimeout(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    console.group('Performance Metrics');
    console.log('First Contentful Paint:', paint.find(p => p.name === 'first-contentful-paint')?.startTime);
    console.log('DOM Interactive:', navigation.domInteractive);
    console.log('DOM Complete:', navigation.domComplete);
    console.log('Load Total:', navigation.loadEventEnd - navigation.startTime);
    console.groupEnd();
  }, 0);
});
