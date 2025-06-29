
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BackToTop from "@/components/navigation/BackToTop";
import { useAnalytics } from "@/hooks/use-analytics";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WelcomeModal } from "@/components/welcome/WelcomeModal";
import { ProductInfoModal } from "@/components/welcome/ProductInfoModal";

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  // Show footer on home page and about page
  const showFooter = location.pathname === "/" || location.pathname === "/index" || location.pathname === "/about";
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
    
    // Preload common routes for better performance
    const preloadRoutes = ['/', '/about', '/rhca', '/igm', '/submission'];
    preloadRoutes.forEach(route => {
      if (!document.head.querySelector(`link[rel="prefetch"][href="${route}"]`)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        link.as = 'document';
        document.head.appendChild(link);
      }
    });
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
      }, 150);
      
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
    }, 800);
    
    return () => clearTimeout(safetyTimer);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <div ref={navbarRef}>
        <Navbar />
      </div>
      
      <main 
        className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden" 
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
