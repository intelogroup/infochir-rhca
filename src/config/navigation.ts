
import { BookOpen, Database, Newspaper, Info, Book, FileText, List, Globe, Link } from "lucide-react";
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
  Info,
  Book,
  FileText,
  List,
  Globe,
  Link,
} as const;

export const navItems: NavItem[] = [
  { 
    name: "RHCA", 
    href: "/rhca",
    icon: Globe,
    description: "Publiez vos articles scientifiques et contribuez à l'avancement des connaissances en chirurgie et anesthésiologie",
    logo: "/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
  },
  {
    name: "IGM",
    href: "/igm",
    icon: Newspaper,
    description: "Restez informé des dernières nouvelles et évolutions du domaine médical avec notre gazette médicale",
    logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
  },
  {
    name: "Atlas",
    href: "/adc",
    icon: BookOpen,
    description: "Explorez une base visuelle unique de diagnostics chirurgicaux pour faciliter vos pratiques cliniques",
    logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
  },
  {
    name: "Index Medicus",
    href: "/index-medicus",
    icon: Database,
    description: "Accédez à une vaste base de données de références médicales organisées par auteur et thème",
    logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
  },
  {
    name: "À propos",
    href: "/about",
    icon: Info,
    description: "En savoir plus sur INFOCHIR/RHCA"
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
