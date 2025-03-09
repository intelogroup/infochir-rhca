
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import TriggerUploads from "@/pages/TriggerUploads";
// Import the Article component
import { Article } from "@/pages/articles/ArticleDetail";

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
