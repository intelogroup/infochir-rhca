
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import BackToTop from "@/components/navigation/BackToTop";
import { useAnalytics } from "@/hooks/use-analytics";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Navbar } from "@/components/Navbar";

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const showFooter = location.pathname === "/" || location.pathname === "/index";
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const prevPathRef = useRef(location.pathname);
  const navbarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize analytics
  useAnalytics();

  // Mark initial load as complete and notify that the app has loaded
  useEffect(() => {
    setInitialLoadComplete(true);
    
    // Notify that the app has loaded
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('app-loaded'));
      
      // Mark a performance measure
      if (window.performance && window.performance.mark) {
        window.performance.mark('layout-mounted');
      }
    }
  }, []);

  // Handle navigation loading states
  useEffect(() => {
    // Only show loading when changing paths (not on initial load)
    if (initialLoadComplete && location.pathname !== prevPathRef.current) {
      console.log(`Navigation: ${prevPathRef.current} -> ${location.pathname}`);
      setIsLoading(true);
      
      // Reduced timeout for smoother transitions
      const timer = setTimeout(() => {
        setIsLoading(false);
        prevPathRef.current = location.pathname;
        
        // Dispatch route change event
        window.dispatchEvent(new Event('route-changed'));
        console.log(`Navigation complete: ${location.pathname}`);
      }, 150); // Reduced from 300ms to 150ms for faster transitions
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, initialLoadComplete]);

  // Calculate the height offset for the main content based on navbar height
  const [navbarHeight, setNavbarHeight] = useState('4rem');
  
  useEffect(() => {
    if (navbarRef.current) {
      const updateNavHeight = () => {
        const height = `${navbarRef.current?.offsetHeight || 64}px`;
        setNavbarHeight(height);
      };
      
      updateNavHeight();
      window.addEventListener('resize', updateNavHeight);
      return () => window.removeEventListener('resize', updateNavHeight);
    }
  }, []);

  // Ensure content is visible even if animations fail
  useEffect(() => {
    // Safety timeout to ensure content is shown even if animations fail
    const safetyTimer = setTimeout(() => {
      if (isLoading) {
        console.log('Safety timeout triggered - forcing content to display');
        setIsLoading(false);
      }
    }, 800); // Reduced from 2000ms to 800ms
    
    return () => clearTimeout(safetyTimer);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <div ref={navbarRef} className="sticky top-0 z-50">
        <Navbar />
      </div>
      
      <main 
        className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden pt-16 md:pt-[4.5rem] lg:pt-20" 
        style={{ minHeight: `calc(100vh - ${navbarHeight})` }}
        ref={contentRef}
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[50vh] transition-opacity duration-300">
            <LoadingSpinner 
              variant="primary"
              size="lg"
              text="Chargement..."
            />
          </div>
        ) : (
          <div className="w-full transition-opacity duration-300">
            {children || <Outlet />}
            
            {/* Fallback content in case children or Outlet fail to render */}
            <div id="content-fallback" style={{ display: 'none' }}>
              {location.pathname === '/' && <div className="text-center p-8">Page d'accueil</div>}
            </div>
          </div>
        )}
      </main>
      
      {showFooter && <Footer />}
      <BackToTop />
    </div>
  );
};
