import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Preload critical routes
const Home = lazy(() => import("@/pages/Home"));
const RHCA = lazy(() => import("@/pages/RHCA"));
const IGM = lazy(() => import("@/pages/IGM"));

// Lazy load less frequently accessed routes
const ADC = lazy(() => {
  // Add a small delay to prioritize main routes
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(import("@/pages/ADC"));
    }, 100);
  });
});

const IndexMedicus = lazy(() => import("@/pages/IndexMedicus"));
const About = lazy(() => import("@/pages/About"));
const EditorialCommittee = lazy(() => import("@/pages/EditorialCommittee"));
const Submission = lazy(() => import("@/pages/Submission"));
const Annuaire = lazy(() => import("@/pages/Annuaire"));
const Donate = lazy(() => import("@/pages/Donate"));
const Opportunities = lazy(() => import("@/pages/Opportunities"));
const RHCADirectives = lazy(() => import("@/pages/rhca/Directives"));
const IGMDirectives = lazy(() => import("@/pages/igm/Directives")); 

// Optimized loading skeleton with reduced complexity
const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50/50 p-4 animate-pulse">
    <Skeleton className="h-[100px] w-full rounded-lg mb-4" />
    <Skeleton className="h-[200px] w-full rounded-lg" />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rhca" element={<RHCA />} />
          <Route path="/rhca/directives" element={<RHCADirectives />} />
          <Route path="/igm" element={<IGM />} />
          <Route path="/igm/directives" element={<IGMDirectives />} />
          <Route path="/adc/*" element={<ADC />} />
          <Route path="/igm/editorial-committee" element={<EditorialCommittee />} />
          <Route path="/index-medicus" element={<IndexMedicus />} />
          <Route path="/about" element={<About />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/annuaire" element={<Annuaire />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/jobs" element={<Opportunities />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;