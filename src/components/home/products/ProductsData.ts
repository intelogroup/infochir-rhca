
import { BookOpen, Database, Newspaper } from "lucide-react";

export const products = [
  { 
    title: "RHCA", 
    description: "Articles originaux, cas cliniques et revues en chirurgie et anesthésiologie, publiés par comité de lecture.",
    href: "/rhca",
    icon: BookOpen,
    logo: "/lovable-uploads/d58e1745-03a7-4274-9d8f-889b058635f6.png",
    fullName: "Revue Haïtienne de Chirurgie et d'Anesthésiologie"
  },
  {
    title: "IGM",
    description: "La gazette d'Info Chir : actualités du milieu médical haïtien, comptes rendus et éditoriaux.",
    href: "/igm",
    icon: Newspaper,
    logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
    fullName: "Info Gazette Médicale"
  },
  {
    title: "Atlas ADC",
    description: "Vingt-quatre chapitres illustrés pour appuyer le diagnostic chirurgical au lit du malade.",
    href: "/adc",
    icon: BookOpen,
    logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png",
    fullName: "Atlas de Diagnostic Chirurgical"
  },
  {
    title: "Index Medicus",
    description: "Le répertoire de la littérature médicale haïtienne, indexé par auteur, titre et thème.",
    href: "/index-medicus",
    icon: Database,
    logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png",
    fullName: "Index Medicus"
  }
];
