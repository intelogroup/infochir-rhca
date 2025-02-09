
import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { ToastProvider } from "@/hooks/use-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LazyMotion, domMax } from "framer-motion";

// Lazy load routes
const Home = lazy(() => import("@/pages/Home"));
const RHCA = lazy(() => import("@/pages/RHCA"));
const IGM = lazy(() => import("@/pages/IGM"));
const Donate = lazy(() => import("@/pages/Donate"));
const DonateSuccess = lazy(() => import("@/pages/donate/DonateSuccess"));
const ADC = lazy(() => import("@/pages/ADC"));
const IndexMedicus = lazy(() => import("@/pages/IndexMedicus"));
const About = lazy(() => import("@/pages/About"));
const EditorialCommittee = lazy(() => import("@/pages/EditorialCommittee"));
const Submission = lazy(() => import("@/pages/Submission"));
const Annuaire = lazy(() => import("@/pages/Annuaire"));
const Opportunities = lazy(() => import("@/pages/Opportunities"));
const RHCADirectives = lazy(() => import("@/pages/rhca/Directives"));
const IGMDirectives = lazy(() => import("@/pages/igm/Directives"));

function AppRoutes() {
  const location = useLocation();

  return (
    <MainLayout>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/rhca" element={<RHCA />} />
          <Route path="/rhca/directives" element={<RHCADirectives />} />
          <Route path="/igm" element={<IGM />} />
          <Route path="/igm/directives" element={<IGMDirectives />} />
          <Route path="/igm/editorial-committee" element={<EditorialCommittee />} />
          <Route path="/about" element={<About />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/annuaire" element={<Annuaire />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/success" element={<DonateSuccess />} />
          <Route path="/jobs" element={<Opportunities />} />
          <Route path="/adc" element={<ADC />} />
          <Route path="/index-medicus" element={<IndexMedicus />} />
        </Routes>
      </AnimatePresence>
    </MainLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <LazyMotion features={domMax} strict>
            <Suspense fallback={<LoadingSpinner />}>
              <AppRoutes />
            </Suspense>
            <Toaster />
          </LazyMotion>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
