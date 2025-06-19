
import { CarouselSection } from "./types";

export const carouselData: CarouselSection[] = [
  {
    title: "Articles récents",
    subtitle: "Découvrez nos dernières publications scientifiques",
    items: [
      {
        id: "1",
        title: "Innovations en chirurgie cardiaque",
        description: "Les dernières avancées en matière de chirurgie cardiaque minimalement invasive",
        abstract: "Cette étude présente les innovations récentes en chirurgie cardiaque, notamment les techniques minimalement invasives qui révolutionnent le domaine.",
        image: "/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png",
        author: "Dr. Jean Baptiste",
        date: "2024-01-15",
        category: "Chirurgie",
        source: "RHCA",
        type: "article"
      },
      {
        id: "2",
        title: "Anesthésie pédiatrique moderne",
        description: "Nouvelles approches en anesthésie pour les enfants",
        abstract: "Un aperçu complet des techniques modernes d'anesthésie pédiatrique et leur impact sur la sécurité des patients.",
        image: "/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png",
        author: "Dr. Marie Claire",
        date: "2024-01-10",
        category: "Anesthésie",
        source: "IGM",
        type: "article"
      },
      {
        id: "3",
        title: "Diagnostic par imagerie avancée",
        description: "L'imagerie médicale au service du diagnostic chirurgical",
        abstract: "Cette publication explore les avancées en imagerie médicale et leur application dans le diagnostic chirurgical.",
        image: "/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png",
        author: "Dr. Pierre Louis",
        date: "2024-01-05",
        category: "Diagnostic",
        source: "ADC",
        type: "article"
      }
    ]
  },
  {
    title: "Événements à venir",
    subtitle: "Participez à nos prochaines formations et conférences",
    items: [
      {
        id: "4",
        title: "Conférence Internationale de Chirurgie",
        description: "3 jours de conférences avec les meilleurs spécialistes",
        image: "/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png",
        date: "2024-03-15",
        category: "Conférence",
        type: "event"
      },
      {
        id: "5",
        title: "Formation en Techniques Laparoscopiques",
        description: "Workshop pratique sur les techniques chirurgicales modernes",
        image: "/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png",
        date: "2024-02-20",
        category: "Formation",
        type: "training"
      }
    ]
  }
];
