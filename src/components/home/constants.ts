import { BookOpen, Database, Newspaper } from "lucide-react";
import type { ProductCardProps } from "@/types";

export const products: (ProductCardProps & { href: string })[] = [
  {
    title: "RHCA",
    description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie - Publiez vos articles scientifiques.",
    icon: BookOpen,
    href: "/rhca",
    logo: "/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
  },
  {
    title: "Index Medicus",
    description: "Accédez à des références médicales organisées par auteur et thème.",
    icon: Database,
    href: "/index-medicus",
    logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
  },
  {
    title: "Atlas ADC",
    description: "Explorez une base visuelle unique pour faciliter vos diagnostics.",
    icon: BookOpen,
    href: "/adc",
    logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
  },
  {
    title: "IGM",
    description: "Restez informé des dernières nouvelles et évolutions du domaine médical.",
    icon: Newspaper,
    href: "/igm",
    logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
  },
];