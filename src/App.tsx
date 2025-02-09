
import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ToastProvider } from "@/hooks/use-toast";
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
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><Home /></Suspense></MainLayout>} />
      <Route path="/rhca" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><RHCA /></Suspense></MainLayout>} />
      <Route path="/rhca/directives" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><RHCADirectives /></Suspense></MainLayout>} />
      <Route path="/igm" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><IGM /></Suspense></MainLayout>} />
      <Route path="/igm/directives" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><IGMDirectives /></Suspense></MainLayout>} />
      <Route path="/igm/editorial-committee" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><EditorialCommittee /></Suspense></MainLayout>} />
      <Route path="/about" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><About /></Suspense></MainLayout>} />
      <Route path="/submission" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><Submission /></Suspense></MainLayout>} />
      <Route path="/annuaire" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><Annuaire /></Suspense></MainLayout>} />
      <Route path="/donate" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><Donate /></Suspense></MainLayout>} />
      <Route path="/donate/success" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><DonateSuccess /></Suspense></MainLayout>} />
      <Route path="/jobs" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><Opportunities /></Suspense></MainLayout>} />
      <Route path="/adc" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><ADC /></Suspense></MainLayout>} />
      <Route path="/index-medicus" element={<MainLayout><Suspense fallback={<LoadingSpinner />}><IndexMedicus /></Suspense></MainLayout>} />
    </Routes>
  );
}

function App() {
  return (
    <LazyMotion features={domMax} strict>
      <ToastProvider>
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <AppRoutes />
        </AnimatePresence>
        <Toaster />
      </ToastProvider>
    </LazyMotion>
  );
}

export default App;
