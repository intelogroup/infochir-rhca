
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

const LoadingFallback = () => (
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
);

export const AppRoutes = () => {
  const location = useLocation();
  const { isTransitioning, transitionKey } = usePageTransition(location);
  
  // Call useScrollToTop with a stable location key to prevent duplicate scrolling
  useScrollToTop(transitionKey);

  return (
    <ErrorBoundary>
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
              <Route path="/" element={
                <RouteWrapper 
                  component={LazyComponents.Home} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/donate" element={
                <RouteWrapper 
                  component={LazyComponents.Donate} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/donate/success" element={
                <RouteWrapper 
                  component={LazyComponents.DonateSuccess} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/rhca" element={
                <RouteWrapper 
                  component={LazyComponents.RHCA} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/rhca/directives" element={
                <RouteWrapper 
                  component={LazyComponents.RHCADirectives} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/igm" element={
                <RouteWrapper 
                  component={LazyComponents.IGM} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/igm/directives" element={
                <RouteWrapper 
                  component={LazyComponents.IGMDirectives} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/igm/editorial-committee" element={
                <RouteWrapper 
                  component={LazyComponents.IGMEditorialCommittee} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/igm/editorial" element={
                <RouteWrapper 
                  component={LazyComponents.IGMEditorialCommittee} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/editorial-committee" element={
                <RouteWrapper 
                  component={LazyComponents.EditorialCommittee} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/about" element={
                <RouteWrapper 
                  component={LazyComponents.About} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/submission" element={
                <RouteWrapper 
                  component={LazyComponents.Submission} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/annuaire" element={
                <RouteWrapper 
                  component={LazyComponents.Annuaire} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/jobs" element={
                <RouteWrapper 
                  component={LazyComponents.Opportunities} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/adc" element={
                <RouteWrapper 
                  component={LazyComponents.ADC} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/index-medicus" element={
                <RouteWrapper 
                  component={LazyComponents.IndexMedicus} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              {/* Add specific article route */}
              <Route path="/articles/:id" element={
                <RouteWrapper 
                  component={LazyComponents.ArticleDetail} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              
              {/* Add a 404 catch-all route */}
              <Route path="*" element={
                <RouteWrapper 
                  component={LazyComponents.NotFound} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={
                <AdminRouteWrapper 
                  component={LazyComponents.AdminDashboard} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/admin/content" element={
                <AdminRouteWrapper 
                  component={LazyComponents.AdminContent} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/admin/users" element={
                <AdminRouteWrapper 
                  component={LazyComponents.AdminUsers} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/admin/analytics" element={
                <AdminRouteWrapper 
                  component={LazyComponents.AdminAnalytics} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              <Route path="/admin/settings" element={
                <AdminRouteWrapper 
                  component={LazyComponents.AdminSettings} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
              
              {/* Add admin 404 route */}
              <Route path="/admin/*" element={
                <AdminRouteWrapper 
                  component={LazyComponents.AdminNotFound} 
                  loadingFallback={<LoadingFallback />}
                />
              } />
            </Route>
          </Routes>
        </m.div>
      </LazyMotion>
    </ErrorBoundary>
  );
};
