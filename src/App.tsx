import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import RHCA from "./pages/RHCA";

const queryClient = new QueryClient();

const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <div className="min-h-screen">
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/rhca" element={<RHCA />} />
                <Route path="/igm" element={<div>IGM Page (Coming Soon)</div>} />
                <Route path="/adc" element={<div>Atlas ADC Page (Coming Soon)</div>} />
                <Route path="/index-medicus" element={<div>Index Medicus Page (Coming Soon)</div>} />
                <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
                <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
              </Routes>
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;