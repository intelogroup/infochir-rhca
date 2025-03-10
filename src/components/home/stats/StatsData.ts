
import { StatsCardProps } from "@/components/ui/stats-card";
import { BookOpen, Users, Eye, Download } from "lucide-react";

export const defaultStats: StatsCardProps[] = [
  {
    title: "Publications",
    value: "95",
    description: "Journals Publiés",
    icon: BookOpen,
    iconClassName: "text-blue-600",
  },
  {
    title: "Membres",
    value: "0",
    description: "Professionnels de santé",
    icon: Users,
    iconClassName: "text-green-600",
  },
  {
    title: "Lecteurs",
    value: "0",
    description: "Lecteurs mensuels",
    icon: Eye,
    iconClassName: "text-purple-600",
  },
  {
    title: "Téléchargements",
    value: "0",
    description: "Documents téléchargés",
    icon: Download,
    iconClassName: "text-orange-600",
  },
];
