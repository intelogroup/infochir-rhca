
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import About from '@/pages/About';
import RHCA from '@/pages/RHCA';
import IGM from '@/pages/IGM';
import ADC from '@/pages/ADC';
import IndexMedicus from '@/pages/IndexMedicus';
import Annuaire from '@/pages/Annuaire';
import Directives from '@/pages/Directives';
import EditorialCommittee from '@/pages/EditorialCommittee';
import Submission from '@/pages/Submission';
import Donate from '@/pages/Donate';
import Opportunities from '@/pages/Opportunities';
import NotFound from '@/pages/NotFound';
import TriggerUploads from '@/pages/TriggerUploads';

// Admin components
import { AdminRouteWrapper } from '@/components/routing/AdminRouteWrapper';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminSettings from '@/pages/admin/Settings';
import AdminAnalytics from '@/pages/admin/Analytics';
import IndexMedicusAdmin from '@/pages/admin/IndexMedicusAdmin';
import AdminEmailSettings from '@/pages/admin/EmailSettings';
import AdminLogin from '@/pages/admin/Login';
import Content from '@/pages/admin/Content';
import ArticleCreate from '@/pages/admin/ArticleCreate';
import FileManagement from '@/pages/admin/FileManagement';
import Debug from '@/pages/admin/Debug';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/rhca" element={<RHCA />} />
      <Route path="/igm" element={<IGM />} />
      <Route path="/adc" element={<ADC />} />
      <Route path="/index-medicus" element={<IndexMedicus />} />
      <Route path="/annuaire" element={<Annuaire />} />
      <Route path="/directives" element={<Directives />} />
      <Route path="/editorial-committee" element={<EditorialCommittee />} />
      <Route path="/submission" element={<Submission />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/trigger-uploads" element={<TriggerUploads />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <AdminRouteWrapper component={AdminDashboard}>
          <AdminDashboard />
        </AdminRouteWrapper>
      } />
      <Route path="/admin/content" element={
        <AdminRouteWrapper component={Content}>
          <Content />
        </AdminRouteWrapper>
      } />
      <Route path="/admin/articles/new" element={
        <AdminRouteWrapper component={ArticleCreate}>
          <ArticleCreate />
        </AdminRouteWrapper>
      } />
      <Route path="/admin/files" element={
        <AdminRouteWrapper component={FileManagement}>
          <FileManagement />
        </AdminRouteWrapper>
      } />
      <Route path="/admin/users" element={
        <AdminRouteWrapper component={AdminUsers}>
          <AdminUsers />
        </AdminRouteWrapper>
      } />
      <Route path="/admin/analytics" element={
        <AdminRouteWrapper component={AdminAnalytics}>
          <AdminAnalytics />
        </AdminRouteWrapper>
      } />
      <Route path="/admin/index-medicus" element={
        <AdminRouteWrapper component={IndexMedicusAdmin}>
          <IndexMedicusAdmin />
        </AdminRouteWrapper>
      } />
      <Route path="/admin/settings" element={
        <AdminRouteWrapper component={AdminSettings}>
          <AdminSettings />
        </AdminRouteWrapper>
      } />
      <Route path="/admin/email-settings" element={
        <AdminRouteWrapper component={AdminEmailSettings}>
          <AdminEmailSettings />
        </AdminRouteWrapper>
      } />
      <Route path="/admin/debug" element={
        <AdminRouteWrapper component={Debug}>
          <Debug />
        </AdminRouteWrapper>
      } />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
