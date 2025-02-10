import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { LazyMotion, domMax } from "framer-motion";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

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
    <ErrorBoundary>
      <MainLayout>
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <Home />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/rhca"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <RHCA />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/rhca/directives"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <RHCADirectives />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/igm"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <IGM />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/igm/directives"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <IGMDirectives />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/igm/editorial-committee"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <EditorialCommittee />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <About />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/submission"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <Submission />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/annuaire"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <Annuaire />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/donate"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <Donate />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/donate/success"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <DonateSuccess />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/jobs"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <Opportunities />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/adc"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <ADC />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/index-medicus"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <IndexMedicus />
                  </ErrorBoundary>
                </Suspense>
              }
            />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LazyMotion features={domMax} strict>
        <ToastProvider>
          <AppRoutes />
          <Toaster />
        </ToastProvider>
      </LazyMotion>
    </ErrorBoundary>
  );
}

export default App;
