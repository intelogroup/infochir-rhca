import { RouteWrapper } from "@/components/routing/RouteWrapper";
import { MainLayout } from "@/components/layouts/MainLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import RHCA from "@/pages/RHCA";
import IGM from "@/pages/IGM";
import ADC from "@/pages/ADC";
import IndexMedicus from "@/pages/IndexMedicus";
import Annuaire from "@/pages/Annuaire";
import EditorialCommittee from "@/pages/EditorialCommittee";
import Directives from "@/pages/Directives";
import Submission from "@/pages/Submission";
import Donate from "@/pages/Donate";
import DonateSuccess from "@/pages/donate/DonateSuccess";
import Opportunities from "@/pages/Opportunities";
import TriggerUploads from "@/pages/TriggerUploads";
import ArticleDetail from "@/pages/articles/ArticleDetail";
import NotFound from "@/pages/NotFound";
import RhcaDirectives from "@/pages/rhca/Directives";
import RhcaArticleDetail from "@/pages/rhca/RhcaArticleDetail";
import IGMDirectives from "@/pages/igm/Directives";
import IGMEditorialCommittee from "@/pages/igm/EditorialCommittee";
import Dashboard from "@/pages/admin/Dashboard";
import Content from "@/pages/admin/Content";
import Users from "@/pages/admin/Users";
import Analytics from "@/pages/admin/Analytics";
import IndexMedicusAdmin from "@/pages/admin/IndexMedicusAdmin";
import Settings from "@/pages/admin/Settings";
import EmailSettings from "@/pages/admin/EmailSettings";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Navigate } from "react-router-dom";
import { AdminRouteWrapper } from "@/components/routing/AdminRouteWrapper";
import AdminLogin from "@/pages/admin/Login";

export const routes = [
  {
    path: "/",
    element: (
      <RouteWrapper>
        <MainLayout>
          <Home />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "/about",
    element: (
      <RouteWrapper>
        <MainLayout>
          <About />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "/rhca",
    children: [
      {
        index: true,
        element: (
          <RouteWrapper>
            <MainLayout>
              <RHCA />
            </MainLayout>
          </RouteWrapper>
        ),
      },
      {
        path: "directives",
        element: (
          <RouteWrapper>
            <MainLayout>
              <RhcaDirectives />
            </MainLayout>
          </RouteWrapper>
        ),
      },
      {
        path: "article/:id",
        element: (
          <RouteWrapper>
            <MainLayout>
              <RhcaArticleDetail />
            </MainLayout>
          </RouteWrapper>
        ),
      },
    ],
  },
  {
    path: "/igm",
    children: [
      {
        index: true,
        element: (
          <RouteWrapper>
            <MainLayout>
              <IGM />
            </MainLayout>
          </RouteWrapper>
        ),
      },
      {
        path: "directives",
        element: (
          <RouteWrapper>
            <MainLayout>
              <IGMDirectives />
            </MainLayout>
          </RouteWrapper>
        ),
      },
      {
        path: "editorial-committee",
        element: (
          <RouteWrapper>
            <MainLayout>
              <IGMEditorialCommittee />
            </MainLayout>
          </RouteWrapper>
        ),
      },
    ],
  },
  {
    path: "/adc",
    element: (
      <RouteWrapper>
        <MainLayout>
          <ADC />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "/index-medicus",
    element: (
      <RouteWrapper>
        <MainLayout>
          <IndexMedicus />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "/annuaire",
    element: (
      <RouteWrapper>
        <MainLayout>
          <Annuaire />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "/editorial-committee",
    element: (
      <RouteWrapper>
        <MainLayout>
          <EditorialCommittee />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "/directives",
    element: (
      <RouteWrapper>
        <MainLayout>
          <Directives />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "/submission",
    element: (
      <RouteWrapper>
        <MainLayout>
          <Submission />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "/donate",
    children: [
      {
        index: true,
        element: (
          <RouteWrapper>
            <MainLayout>
              <Donate />
            </MainLayout>
          </RouteWrapper>
        ),
      },
      {
        path: "success",
        element: (
          <RouteWrapper>
            <MainLayout>
              <DonateSuccess />
            </MainLayout>
          </RouteWrapper>
        ),
      },
    ],
  },
  {
    path: "/opportunities",
    element: (
      <RouteWrapper>
        <MainLayout>
          <Opportunities />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "/trigger-uploads",
    element: (
      <RouteWrapper>
        <MainLayout>
          <TriggerUploads />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  // Admin routes
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <AdminRouteWrapper component={() => <Navigate to="/admin/dashboard" replace />} />
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminRouteWrapper component={() => (
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      )} />
    ),
  },
  {
    path: "/admin/content",
    element: (
      <AdminRouteWrapper component={() => (
        <AdminLayout>
          <Content />
        </AdminLayout>
      )} />
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminRouteWrapper component={() => (
        <AdminLayout>
          <Users />
        </AdminLayout>
      )} />
    ),
  },
  {
    path: "/admin/analytics",
    element: (
      <AdminRouteWrapper component={() => (
        <AdminLayout>
          <Analytics />
        </AdminLayout>
      )} />
    ),
  },
  {
    path: "/admin/index-medicus",
    element: (
      <AdminRouteWrapper component={() => (
        <AdminLayout>
          <IndexMedicusAdmin />
        </AdminLayout>
      )} />
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <AdminRouteWrapper component={() => (
        <AdminLayout>
          <Settings />
        </AdminLayout>
      )} />
    ),
  },
  {
    path: "/admin/email-settings",
    element: (
      <AdminRouteWrapper component={() => (
        <AdminLayout>
          <EmailSettings />
        </AdminLayout>
      )} />
    ),
  },
  {
    path: "/articles/:id",
    element: (
      <RouteWrapper>
        <MainLayout>
          <ArticleDetail />
        </MainLayout>
      </RouteWrapper>
    ),
  },
  {
    path: "*",
    element: (
      <RouteWrapper>
        <MainLayout>
          <NotFound />
        </MainLayout>
      </RouteWrapper>
    ),
  },
];
