import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all pages for better initial bundle size
const Home = lazy(() => import("@/pages/Home"));
const RHCA = lazy(() => import("@/pages/RHCA"));
const IGM = lazy(() => import("@/pages/IGM"));
const ADC = lazy(() => import("@/pages/ADC"));
const IndexMedicus = lazy(() => import("@/pages/IndexMedicus"));
const About = lazy(() => import("@/pages/About"));
const EditorialCommittee = lazy(() => import("@/pages/EditorialCommittee"));
const Submission = lazy(() => import("@/pages/Submission"));
const Annuaire = lazy(() => import("@/pages/Annuaire"));
const Donate = lazy(() => import("@/pages/Donate"));
const Opportunities = lazy(() => import("@/pages/Opportunities"));
const RHCADirectives = lazy(() => import("@/pages/rhca/Directives"));
const IGMDirectives = lazy(() => import("@/pages/igm/Directives")); 

const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-4">
    <Skeleton className="h-[200px] w-full rounded-lg mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-[300px] rounded-lg" />
      <Skeleton className="h-[300px] rounded-lg" />
    </div>
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
