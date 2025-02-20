
import * as React from "react";
import { lazy } from "react";

export const Home = lazy(() => import("@/pages/Home"));
export const RHCA = lazy(() => import("@/pages/RHCA"));
export const IGM = lazy(() => import("@/pages/IGM"));
export const Donate = lazy(() => import("@/pages/Donate"));
export const DonateSuccess = lazy(() => import("@/pages/donate/DonateSuccess"));
export const ADC = lazy(() => import("@/pages/ADC"));
export const IndexMedicus = lazy(() => import("@/pages/IndexMedicus"));
export const About = lazy(() => import("@/pages/About"));
export const EditorialCommittee = lazy(() => import("@/pages/EditorialCommittee"));
export const Submission = lazy(() => import("@/pages/Submission"));
export const Annuaire = lazy(() => import("@/pages/Annuaire"));
export const Opportunities = lazy(() => import("@/pages/Opportunities"));
export const RHCADirectives = lazy(() => import("@/pages/rhca/Directives"));
export const IGMDirectives = lazy(() => import("@/pages/igm/Directives"));

// Admin routes
export const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
export const AdminContent = lazy(() => import("@/pages/admin/Content"));
export const AdminUsers = lazy(() => import("@/pages/admin/Users"));
export const AdminAnalytics = lazy(() => import("@/pages/admin/Analytics"));
export const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
