
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
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
      {/* Public Routes wrapped in MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="rhca" element={<RHCA />} />
        <Route path="igm" element={<IGM />} />
        <Route path="adc" element={<ADC />} />
        <Route path="index-medicus" element={<IndexMedicus />} />
        <Route path="annuaire" element={<Annuaire />} />
        <Route path="directives" element={<Directives />} />
        <Route path="editorial-committee" element={<EditorialCommittee />} />
        <Route path="submission" element={<Submission />} />
        <Route path="donate" element={<Donate />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="trigger-uploads" element={<TriggerUploads />} />
      </Route>

      {/* Admin Login Route (no sidebar) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes with AdminLayout (includes sidebar) */}
      <Route path="/admin" element={
        <AdminRouteWrapper component={AdminLayout}>
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="content" element={<Content />} />
              <Route path="articles/new" element={<ArticleCreate />} />
              <Route path="files" element={<FileManagement />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="index-medicus" element={<IndexMedicusAdmin />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="email-settings" element={<AdminEmailSettings />} />
              <Route path="debug" element={<Debug />} />
            </Routes>
          </AdminLayout>
        </AdminRouteWrapper>
      } />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
