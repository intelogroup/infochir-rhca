
import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { RouteWrapper } from "./RouteWrapper";
import { AdminRouteWrapper } from "./AdminRouteWrapper";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import * as LazyComponents from "@/config/routes";

export const AppRoutes = () => {
  const location = useLocation();
  useScrollToTop();

  return (
    <ErrorBoundary>
      <Routes location={location}>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<RouteWrapper component={LazyComponents.Home} />} />
          <Route path="/donate" element={<RouteWrapper component={LazyComponents.Donate} />} />
          <Route path="/donate/success" element={<RouteWrapper component={LazyComponents.DonateSuccess} />} />
          <Route path="/rhca" element={<RouteWrapper component={LazyComponents.RHCA} />} />
          <Route path="/rhca/directives" element={<RouteWrapper component={LazyComponents.RHCADirectives} />} />
          <Route path="/igm" element={<RouteWrapper component={LazyComponents.IGM} />} />
          <Route path="/igm/directives" element={<RouteWrapper component={LazyComponents.IGMDirectives} />} />
          <Route path="/igm/editorial-committee" element={<RouteWrapper component={LazyComponents.IGMEditorialCommittee} />} />
          <Route path="/igm/editorial" element={<RouteWrapper component={LazyComponents.IGMEditorialCommittee} />} />
          <Route path="/editorial-committee" element={<RouteWrapper component={LazyComponents.EditorialCommittee} />} />
          <Route path="/about" element={<RouteWrapper component={LazyComponents.About} />} />
          <Route path="/submission" element={<RouteWrapper component={LazyComponents.Submission} />} />
          <Route path="/annuaire" element={<RouteWrapper component={LazyComponents.Annuaire} />} />
          <Route path="/jobs" element={<RouteWrapper component={LazyComponents.Opportunities} />} />
          <Route path="/adc" element={<RouteWrapper component={LazyComponents.ADC} />} />
          <Route path="/index-medicus" element={<RouteWrapper component={LazyComponents.IndexMedicus} />} />
          {/* Add specific article route */}
          <Route path="/articles/:id" element={<RouteWrapper component={LazyComponents.ArticleDetail} />} />
          
          {/* Add a 404 catch-all route */}
          <Route path="*" element={<RouteWrapper component={LazyComponents.NotFound} />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminRouteWrapper component={LazyComponents.AdminDashboard} />} />
          <Route path="/admin/content" element={<AdminRouteWrapper component={LazyComponents.AdminContent} />} />
          <Route path="/admin/users" element={<AdminRouteWrapper component={LazyComponents.AdminUsers} />} />
          <Route path="/admin/analytics" element={<AdminRouteWrapper component={LazyComponents.AdminAnalytics} />} />
          <Route path="/admin/settings" element={<AdminRouteWrapper component={LazyComponents.AdminSettings} />} />
          
          {/* Add admin 404 route */}
          <Route path="/admin/*" element={<AdminRouteWrapper component={LazyComponents.AdminNotFound} />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};
