
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import TriggerUploads from "@/pages/TriggerUploads";
import ArticleDetail from "@/pages/articles/ArticleDetail";
import { MainLayout } from "@/components/layouts/MainLayout";
import About from "@/pages/About";
import RHCA from "@/pages/RHCA";
import ADC from "@/pages/ADC";
import IGM from "@/pages/IGM";
import Submission from "@/pages/Submission";
import Annuaire from "@/pages/Annuaire";
import IndexMedicus from "@/pages/IndexMedicus";
import Donate from "@/pages/Donate";
import Opportunities from "@/pages/Opportunities";
import EditorialCommittee from "@/pages/EditorialCommittee";
import DonateSuccess from "@/pages/donate/DonateSuccess";

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
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
        path: "submission",
        element: <Submission />,
        name: "submission",
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
        path: "admin/uploads",
        element: <TriggerUploads />,
        name: "uploads",
      },
      {
        path: "*",
        element: <NotFound />,
        name: "notFound",
      },
    ],
  },
];
