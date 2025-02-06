
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

// Preload critical routes with priority loading
const Home = lazy(() => import("@/pages/Home" /* webpackPrefetch: true */));
const RHCA = lazy(() => import("@/pages/RHCA" /* webpackPrefetch: true */));
const IGM = lazy(() => import("@/pages/IGM" /* webpackPrefetch: true */));

// Lazy load less frequently accessed routes with delay and lower priority
const ADC = lazy(() => 
  new Promise(resolve => 
    setTimeout(() => resolve(import("@/pages/ADC")), 100)
  ) as Promise<typeof import("@/pages/ADC")>
);

const IndexMedicus = lazy(() => 
  import("@/pages/IndexMedicus").then(module => {
    // Preload related components after main chunk loads
    const preloadComponents = async () => {
      const [ArticleGrid, SearchBar] = await Promise.all([
        import("@/components/index-medicus/ArticleGrid"),
        import("@/components/index-medicus/SearchBar")
      ]);
      return module;
    };
    return preloadComponents();
  })
);

const About = lazy(() => import("@/pages/About"));
const EditorialCommittee = lazy(() => import("@/pages/EditorialCommittee"));
const Submission = lazy(() => import("@/pages/Submission"));
const Annuaire = lazy(() => import("@/pages/Annuaire"));
const Donate = lazy(() => import("@/pages/Donate"));
const Opportunities = lazy(() => import("@/pages/Opportunities"));
const RHCADirectives = lazy(() => import("@/pages/rhca/Directives"));
const IGMDirectives = lazy(() => import("@/pages/igm/Directives")); 

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
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
    </QueryClientProvider>
  );
}

export default App;
