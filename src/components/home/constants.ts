import { BookOpen, FileText, ChartBar, Database } from "lucide-react";
import type { ProductCardProps } from "@/components/ProductCard";

export const products: (ProductCardProps & { href: string })[] = [
  {
    title: "RHCA",
    description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie",
    icon: BookOpen,
    href: "/rhca",
    logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
  },
  {
    title: "IGM",
    description: "Info Gynéco Médicale",
    icon: FileText,
    href: "/igm",
    logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
  },
  {
    title: "ADC",
    description: "Archives de Diagnostic Clinique",
    icon: ChartBar,
    href: "/adc",
    logo: "/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
  },
  {
    title: "Index Médicus",
    description: "Base de données médicales",
    icon: Database,
    href: "/index-medicus",
    logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
  }
];