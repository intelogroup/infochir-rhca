
import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LazyMotion, m, domMax } from "framer-motion";
import { MainLayout } from "@/components/layouts/MainLayout";
import { RouteWrapper } from "./RouteWrapper";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import * as LazyComponents from "@/config/routes";

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <MainLayout>
        <LazyMotion features={domMax} strict>
          <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
            <m.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Routes location={location}>
                <Route path="/" element={<RouteWrapper component={LazyComponents.Home} />} />
                <Route path="/donate" element={<RouteWrapper component={LazyComponents.Donate} />} />
                <Route path="/donate/success" element={<RouteWrapper component={LazyComponents.DonateSuccess} />} />
                <Route path="/rhca" element={<RouteWrapper component={LazyComponents.RHCA} />} />
                <Route path="/rhca/directives" element={<RouteWrapper component={LazyComponents.RHCADirectives} />} />
                <Route path="/igm" element={<RouteWrapper component={LazyComponents.IGM} />} />
                <Route path="/igm/directives" element={<RouteWrapper component={LazyComponents.IGMDirectives} />} />
                <Route path="/igm/editorial-committee" element={<RouteWrapper component={LazyComponents.EditorialCommittee} />} />
                <Route path="/about" element={<RouteWrapper component={LazyComponents.About} />} />
                <Route path="/submission" element={<RouteWrapper component={LazyComponents.Submission} />} />
                <Route path="/annuaire" element={<RouteWrapper component={LazyComponents.Annuaire} />} />
                <Route path="/jobs" element={<RouteWrapper component={LazyComponents.Opportunities} />} />
                <Route path="/adc" element={<RouteWrapper component={LazyComponents.ADC} />} />
                <Route path="/index-medicus" element={<RouteWrapper component={LazyComponents.IndexMedicus} />} />
              </Routes>
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </MainLayout>
    </ErrorBoundary>
  );
};
