import { BookOpen, Database, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  description?: string;
  icon?: any;
  logo?: string;
  bgImage?: string;
};

export type Product = {
  title: string;
  description: string;
  href: string;
  icon: keyof typeof icons;
  logo?: string;
  bgImage?: string;
};

const icons = {
  BookOpen,
  Database,
  Newspaper,
} as const;

export const navItems: NavItem[] = [
  { 
    name: "RHCA", 
    href: "/rhca",
    icon: BookOpen,
    description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie",
    logo: "/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png",
    bgImage: "/lovable-uploads/3686281a-0f1a-46e8-a03f-c56d49e3d791.png"
  },
  {
    name: "IGM",
    href: "/igm",
    icon: Newspaper,
    description: "Informations Générales Médicales",
    logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
  },
  {
    name: "Atlas ADC",
    href: "/adc",
    icon: BookOpen,
    description: "Atlas de Diagnostic Chirurgical",
    logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
  },
  {
    name: "Index Medicus",
    href: "/index-medicus",
    icon: Database,
    description: "Base de données médicales",
    logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
  }
];

export const products: Product[] = navItems.map(item => ({
  title: item.name,
  description: item.description || "",
  href: item.href,
  icon: item.icon.name as keyof typeof icons,
  logo: item.logo,
  bgImage: item.bgImage
}));

export const userNavigation = [
  { name: "Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
  { name: "Sign out", href: "#" }
] as const;