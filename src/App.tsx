import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { useSession, SessionProvider } from './hooks/useSession';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

// Import components
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import IGM from './pages/IGM';
import Issues from './pages/Issues';
import IssueDetail from './pages/IssueDetail';
import IndexMedicus from './pages/IndexMedicus';
import ADC from './pages/ADC';
import AdminRouteWrapper from './components/auth/AdminRouteWrapper';
import Dashboard from './pages/admin/Dashboard';
import Content from './pages/admin/Content';
import Users from './pages/admin/Users';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import AdminNotFound from './pages/admin/AdminNotFound';
import ArticleDetail from './pages/ArticleDetail';
import SearchResults from './pages/SearchResults';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AccessibilityStatement from './pages/AccessibilityStatement';
import TermsOfService from './pages/TermsOfService';

// Import the new admin page
import IndexMedicusAdmin from './pages/admin/IndexMedicusAdmin';

const queryClient = new QueryClient();

function App() {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const { session } = useSession();

  return (
    <SessionProvider value={session}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Toaster position="bottom-center" richColors closeButton />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            
            {/* IGM Routes */}
            <Route path="/igm" element={<IGM />} />
            <Route path="/igm/issues" element={<Issues />} />
            <Route path="/igm/issues/:id" element={<IssueDetail />} />

            {/* Index Medicus Routes */}
            <Route path="/index-medicus" element={<IndexMedicus />} />

            {/* ADC Route */}
            <Route path="/adc" element={<ADC />} />

            <Route
              path="/login"
              element={
                !session ? (
                  <div className="flex justify-center items-center min-h-screen">
                    <div className="w-full max-w-md">
                      <Auth
                        supabaseClient={supabaseClient}
                        appearance={{ theme: ThemeSupa }}
                        providers={['google', 'github']}
                        redirectTo={`${window.location.origin}/admin/dashboard`}
                      />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRouteWrapper />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="content" element={<Content />} />
              <Route path="users" element={<Users />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="index-medicus" element={<IndexMedicusAdmin />} /> {/* Add this new route */}
              <Route path="*" element={<AdminNotFound />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
