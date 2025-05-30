
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { AppRoutes } from './components/routing/AppRoutes';

const queryClient = new QueryClient();

function App() {
  // Control initial modals - set localStorage flag to prevent showing on app init
  useEffect(() => {
    // Use localStorage to only show product info on specific product pages
    localStorage.setItem('hasSeenWelcome', 'true');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-center" richColors closeButton />
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
