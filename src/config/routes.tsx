
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import TriggerUploads from "@/pages/TriggerUploads";
import { Article } from "@/pages/articles/ArticleDetail";
import { MainLayout } from "@/components/layouts/MainLayout";

export const routes = [
  {
    path: "/",
    element: <MainLayout><Home /></MainLayout>,
    name: "home",
  },
  {
    path: "/articles/:id",
    element: <MainLayout><Article /></MainLayout>,
    name: "article",
  },
  {
    path: "/admin/uploads",
    element: <MainLayout><TriggerUploads /></MainLayout>,
    name: "uploads",
  },
  {
    path: "*",
    element: <MainLayout><NotFound /></MainLayout>,
    name: "notFound",
  },
];
