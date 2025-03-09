
import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, domMax, m } from "framer-motion";
import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { RouteWrapper } from "./RouteWrapper";
import { AdminRouteWrapper } from "./AdminRouteWrapper";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import * as LazyComponents from "@/config/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTransition } from "@/hooks/usePageTransition";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('Routes');

// Memoize LoadingFallback to prevent unnecessary re-renders
const LoadingFallback = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-white/80">
    <div className="w-full max-w-md space-y-4 p-4">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Create a memoized route component
const MemoizedRoute = React.memo(({ path, component }: { path: string, component: React.ComponentType<any> }) => (
  <Route 
    path={path} 
    element={
      <RouteWrapper 
        component={component} 
        loadingFallback={<LoadingFallback />}
      />
    } 
  />
));

MemoizedRoute.displayName = 'MemoizedRoute';

// Create a memoized admin route component
const MemoizedAdminRoute = React.memo(({ path, component }: { path: string, component: React.ComponentType<any> }) => (
  <Route 
    path={path} 
    element={
      <AdminRouteWrapper 
        component={component} 
        loadingFallback={<LoadingFallback />}
      />
    } 
  />
));

MemoizedAdminRoute.displayName = 'MemoizedAdminRoute';

// Memoize the AppRoutes component
export const AppRoutes = React.memo(() => {
  const location = useLocation();
  const { isTransitioning, transitionKey } = usePageTransition(location);
  
  // Call useScrollToTop with a stable location key to prevent duplicate scrolling
  useScrollToTop(transitionKey);

  // Pre-load important routes when the app loads - fixed version
  React.useEffect(() => {
    // Use import() to properly preload main routes
    const preloadRoutes = async () => {
      try {
        // Create a list of paths to preload
        const commonRoutes = ['/', '/about', '/rhca', '/igm'];
        
        // Safely add preload link tags for common routes
        commonRoutes.forEach(route => {
          if (typeof route === 'string') {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'fetch'; // Use 'fetch' instead of 'document' for routes
            link.href = route;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
          }
        });
        
        logger.log('Preloaded common routes:', commonRoutes);
      } catch (error) {
        logger.error(error, { component: 'AppRoutes', context: 'preloadRoutes' });
      }
    };
    
    preloadRoutes();
  }, []);

  return (
    <ErrorBoundary name="routes">
      <LazyMotion features={domMax} strict>
        <m.div
          key={transitionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="min-h-screen"
        >
          <Routes location={location}>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <MemoizedRoute path="/" component={LazyComponents.Home} />
              <MemoizedRoute path="/donate" component={LazyComponents.Donate} />
              <MemoizedRoute path="/donate/success" component={LazyComponents.DonateSuccess} />
              <MemoizedRoute path="/rhca" component={LazyComponents.RHCA} />
              <MemoizedRoute path="/rhca/directives" component={LazyComponents.RHCADirectives} />
              <MemoizedRoute path="/igm" component={LazyComponents.IGM} />
              <MemoizedRoute path="/igm/directives" component={LazyComponents.IGMDirectives} />
              <MemoizedRoute path="/igm/editorial-committee" component={LazyComponents.IGMEditorialCommittee} />
              <MemoizedRoute path="/igm/editorial" component={LazyComponents.IGMEditorialCommittee} />
              <MemoizedRoute path="/editorial-committee" component={LazyComponents.EditorialCommittee} />
              <MemoizedRoute path="/about" component={LazyComponents.About} />
              <MemoizedRoute path="/submission" component={LazyComponents.Submission} />
              <MemoizedRoute path="/annuaire" component={LazyComponents.Annuaire} />
              <MemoizedRoute path="/jobs" component={LazyComponents.Opportunities} />
              <MemoizedRoute path="/adc" component={LazyComponents.ADC} />
              <MemoizedRoute path="/index-medicus" component={LazyComponents.IndexMedicus} />
              {/* Add specific article route */}
              <MemoizedRoute path="/articles/:id" component={LazyComponents.ArticleDetail} />
              
              {/* Add a 404 catch-all route */}
              <MemoizedRoute path="*" component={LazyComponents.NotFound} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <MemoizedAdminRoute path="/admin" component={LazyComponents.AdminDashboard} />
              <MemoizedAdminRoute path="/admin/content" component={LazyComponents.AdminContent} />
              <MemoizedAdminRoute path="/admin/users" component={LazyComponents.AdminUsers} />
              <MemoizedAdminRoute path="/admin/analytics" component={LazyComponents.AdminAnalytics} />
              <MemoizedAdminRoute path="/admin/settings" component={LazyComponents.AdminSettings} />
              
              {/* Add admin 404 route */}
              <MemoizedAdminRoute path="/admin/*" component={LazyComponents.AdminNotFound} />
            </Route>
          </Routes>
        </m.div>
      </LazyMotion>
    </ErrorBoundary>
  );
});

AppRoutes.displayName = 'AppRoutes';
