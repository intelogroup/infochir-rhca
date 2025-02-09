
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
    <MainLayout>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/rhca"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RHCA />
              </Suspense>
            }
          />
          <Route
            path="/rhca/directives"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RHCADirectives />
              </Suspense>
            }
          />
          <Route
            path="/igm"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <IGM />
              </Suspense>
            }
          />
          <Route
            path="/igm/directives"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <IGMDirectives />
              </Suspense>
            }
          />
          <Route
            path="/igm/editorial-committee"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EditorialCommittee />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="/submission"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Submission />
              </Suspense>
            }
          />
          <Route
            path="/annuaire"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Annuaire />
              </Suspense>
            }
          />
          <Route
            path="/donate"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Donate />
              </Suspense>
            }
          />
          <Route
            path="/donate/success"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <DonateSuccess />
              </Suspense>
            }
          />
          <Route
            path="/jobs"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Opportunities />
              </Suspense>
            }
          />
          <Route
            path="/adc"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ADC />
              </Suspense>
            }
          />
          <Route
            path="/index-medicus"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <IndexMedicus />
              </Suspense>
            }
          />
        </Routes>
      </AnimatePresence>
    </MainLayout>
  );
}

function App() {
  return (
    <LazyMotion features={domMax} strict>
      <ToastProvider>
        <AppRoutes />
        <Toaster />
      </ToastProvider>
    </LazyMotion>
  );
}

export default App;
