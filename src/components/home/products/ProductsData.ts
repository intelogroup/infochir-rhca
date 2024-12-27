import { BookOpen, Database, Newspaper } from "lucide-react";

export const products = [
  { 
    title: "RHCA", 
    description: "Publiez vos articles scientifiques et contribuez à l'avancement des connaissances en chirurgie et anesthésiologie",
    href: "/rhca",
    icon: BookOpen,
    logo: "/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
  },
  {
    title: "IGM",
    description: "Restez informé des dernières nouvelles et évolutions du domaine médical avec notre gazette médicale",
    href: "/igm",
    icon: Newspaper,
    logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
  },
  {
    title: "Atlas ADC",
    description: "Explorez une base visuelle unique de diagnostics chirurgicaux pour faciliter vos pratiques cliniques",
    href: "/adc",
    icon: BookOpen,
    logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
  },
  {
    title: "Index Medicus",
    description: "Accédez à une vaste base de données de références médicales organisées par auteur et thème",
    href: "/index-medicus",
    icon: Database,
    logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
  }
];