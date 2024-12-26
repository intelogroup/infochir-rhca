import { BookOpen, FileText, ChartBar, Database } from "lucide-react";
import type { ProductCardProps } from "@/components/ProductCard";

export const products: (ProductCardProps & { href: string })[] = [
  {
    title: "RHCA",
    description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie",
    icon: BookOpen,
    href: "/rhca",
    logo: "/lovable-uploads/e8fe216b-7e19-48a9-9251-22c63959d38c.png"
  },
  {
    title: "IGM",
    description: "Info Gynéco Médicale",
    icon: FileText,
    href: "/igm",
    logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
  },
  {
    title: "ADC",
    description: "Archives de Diagnostic Clinique",
    icon: ChartBar,
    href: "/adc",
    logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
  },
  {
    title: "Index Médicus",
    description: "Base de données médicales",
    icon: Database,
    href: "/index-medicus",
    logo: "/lovable-uploads/5d3116e3-d5c7-4fb3-a6ae-8ddf2d710f55.png"
  }
];