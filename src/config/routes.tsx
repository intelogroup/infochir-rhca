
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import TriggerUploads from "@/pages/TriggerUploads";
import ArticleDetail from "@/pages/articles/ArticleDetail";
import { MainLayout } from "@/components/layouts/MainLayout";
import About from "@/pages/About";
import RHCA from "@/pages/RHCA";
import RhcaArticleDetail from "@/pages/rhca/RhcaArticleDetail";
import RHCADirectives from "@/pages/rhca/Directives";
import ADC from "@/pages/ADC";
import IGM from "@/pages/IGM";
import IGMDirectives from "@/pages/igm/Directives";
import Submission from "@/pages/Submission";
import Directives from "@/pages/Directives";
import Annuaire from "@/pages/Annuaire";
import IndexMedicus from "@/pages/IndexMedicus";
import Donate from "@/pages/Donate";
import Opportunities from "@/pages/Opportunities";
import EditorialCommittee from "@/pages/EditorialCommittee";
import DonateSuccess from "@/pages/donate/DonateSuccess";
import Analytics from "@/pages/admin/Analytics";
import Dashboard from "@/pages/admin/Dashboard";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import AdminNotFound from "@/pages/admin/NotFound";
import { AdminRouteWrapper } from "@/components/routing/AdminRouteWrapper";

export const routes = [
  {
    path: "/",
    element: <MainLayout>{null}</MainLayout>,
    name: "main",
    children: [
      {
        path: "",
        element: <Home />,
        name: "home",
      },
      {
        path: "about",
        element: <About />,
        name: "about",
      },
      {
        path: "rhca",
        element: <RHCA />,
        name: "rhca",
      },
      {
        path: "rhca/article/:id",
        element: <RhcaArticleDetail />,
        name: "rhca-article-detail",
      },
      {
        path: "rhca/directives",
        element: <RHCADirectives />,
        name: "rhca-directives",
      },
      {
        path: "adc",
        element: <ADC />,
        name: "adc",
      },
      {
        path: "igm",
        element: <IGM />,
        name: "igm",
      },
      {
        path: "igm/directives",
        element: <IGMDirectives />,
        name: "igm-directives",
      },
      {
        path: "submission",
        element: <Submission />,
        name: "submission",
      },
      {
        path: "guidelines",
        element: <Directives />,
        name: "guidelines",
      },
      {
        path: "annuaire",
        element: <Annuaire />,
        name: "annuaire",
      },
      {
        path: "index-medicus",
        element: <IndexMedicus />,
        name: "index-medicus",
      },
      {
        path: "donate",
        element: <Donate />,
        name: "donate",
      },
      {
        path: "donate/success",
        element: <DonateSuccess />,
        name: "donate-success",
      },
      {
        path: "opportunities",
        element: <Opportunities />,
        name: "opportunities",
      },
      {
        path: "editorial",
        element: <EditorialCommittee />,
        name: "editorial",
      },
      {
        path: "articles/:id",
        element: <ArticleDetail />,
        name: "article-detail",
      },
      {
        path: "*",
        element: <NotFound />,
        name: "notFound",
      },
    ],
  },
  // New parent admin route with AdminLayout
  {
    path: "/admin",
    element: <AdminRouteWrapper component={() => <AdminLayout><Dashboard /></AdminLayout>} />,
    name: "admin",
  },
  // Admin sub-routes
  {
    path: "/admin/uploads",
    element: <AdminRouteWrapper component={() => <AdminLayout><TriggerUploads /></AdminLayout>} />,
    name: "admin-uploads",
  },
  {
    path: "/admin/analytics",
    element: <AdminRouteWrapper component={() => <AdminLayout><Analytics /></AdminLayout>} />,
    name: "admin-analytics",
  },
  {
    path: "/admin/*",
    element: <AdminRouteWrapper component={() => <AdminLayout><AdminNotFound /></AdminLayout>} />,
    name: "admin-not-found",
  },
];
