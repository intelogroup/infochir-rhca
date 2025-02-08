
import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";

// Preload critical routes
const Home = lazy(() => import("@/pages/Home" /* webpackPrefetch: true */));
const RHCA = lazy(() => import("@/pages/RHCA" /* webpackPrefetch: true */));
const IGM = lazy(() => import("@/pages/IGM" /* webpackPrefetch: true */));
const Donate = lazy(() => import("@/pages/Donate" /* webpackPrefetch: true */));
const DonateSuccess = lazy(() => import("@/pages/donate/DonateSuccess" /* webpackPrefetch: true */));
const ADC = lazy(() => import("@/pages/ADC" /* webpackPrefetch: true */));
const IndexMedicus = lazy(() => import("@/pages/IndexMedicus" /* webpackPrefetch: true */));

// Lazy load less frequently accessed routes
const About = lazy(() => import("@/pages/About"));
const EditorialCommittee = lazy(() => import("@/pages/EditorialCommittee"));
const Submission = lazy(() => import("@/pages/Submission"));
const Annuaire = lazy(() => import("@/pages/Annuaire"));
const Opportunities = lazy(() => import("@/pages/Opportunities"));
const RHCADirectives = lazy(() => import("@/pages/rhca/Directives"));
const IGMDirectives = lazy(() => import("@/pages/igm/Directives")); 

function App() {
  const location = useLocation();
  
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait" initial={false}>
        <Suspense 
          key={location.pathname}
          fallback={<LoadingSpinner />}
        >
          <Routes location={location}>
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
            <Route path="/adc/*" element={<ADC />} />
            <Route path="/index-medicus" element={<IndexMedicus />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Toaster position="top-center" />
    </ErrorBoundary>
  );
}

export default App;
