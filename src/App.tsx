import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import RHCA from "./pages/RHCA";
import Donate from "./pages/Donate";
import ADC from "./pages/ADC";
import IGM from "./pages/IGM";
import About from "./pages/About";
import Annuaire from "./pages/Annuaire";
import Directives from "./pages/rhca/Directives";
import Submission from "./pages/Submission";
import IndexMedicus from "./pages/IndexMedicus";

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
                <Route path="/igm" element={<IGM />} />
                <Route path="/adc" element={<ADC />} />
                <Route path="/index-medicus" element={<IndexMedicus />} />
                <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/about" element={<About />} />
                <Route path="/annuaire" element={<Annuaire />} />
                <Route path="/rhca/directives" element={<Directives />} />
                <Route path="/submission" element={<Submission />} />
              </Routes>
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;