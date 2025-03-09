import { Home } from "@/pages";
import Contact from "@/pages/Contact";
import IGM from "@/pages/IGM";
import Legal from "@/pages/Legal";
import Newsletter from "@/pages/Newsletter";
import NotFound from "@/pages/NotFound";
import Products from "@/pages/Products";
import Sponsors from "@/pages/Sponsors";
import Team from "@/pages/Team";
import { Article } from "@/pages/articles";
import TriggerUploads from "@/pages/TriggerUploads";

export const routes = [
  {
    path: "/",
    element: <Home />,
    name: "home",
  },
  {
    path: "/articles/:id",
    element: <Article />,
    name: "article",
  },
  {
    path: "/produits",
    element: <Products />,
    name: "products",
  },
  {
    path: "/sponsors",
    element: <Sponsors />,
    name: "sponsors",
  },
  {
    path: "/contact",
    element: <Contact />,
    name: "contact",
  },
  {
    path: "/newsletter",
    element: <Newsletter />,
    name: "newsletter",
  },
  {
    path: "/igm",
    element: <IGM />,
    name: "igm",
  },
  {
    path: "/team",
    element: <Team />,
    name: "team",
  },
  {
    path: "/legal",
    element: <Legal />,
    name: "legal",
  },
  {
    path: "/admin/uploads",
    element: <TriggerUploads />,
    name: "uploads",
  },
  {
    path: "*",
    element: <NotFound />,
    name: "notFound",
  },
];
