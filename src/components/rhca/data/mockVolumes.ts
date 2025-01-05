import type { RhcaVolume } from "../types";

export const mockVolumes: RhcaVolume[] = [
  {
    id: "1",
    volume: 1,
    date: "2024-01-15",
    description: "Premier volume de 2024",
    articleCount: 12,
    downloadCount: 450,
    shareCount: 89,
    articles: [
      {
        id: "1",
        title: "Nouvelles approches en chirurgie mini-invasive",
        abstract: "Une étude sur les techniques modernes...",
        authors: ["Dr. Martin", "Dr. Dubois"],
        date: "2024-01-15",
        views: 120,
        citations: 15,
        downloads: 45,
        shares: 23,
        pageNumber: 1,
        volume: 1,
        pdfUrl: "/path/to/pdf1.pdf",
        tags: ["Chirurgie", "Innovation"]
      },
      {
        id: "2",
        title: "L'impact de l'IA en chirurgie",
        abstract: "Analyse des applications de l'intelligence artificielle...",
        authors: ["Dr. Bernard", "Dr. Lambert"],
        date: "2024-01-10",
        views: 95,
        citations: 8,
        downloads: 32,
        shares: 18,
        pageNumber: 15,
        volume: 1,
        pdfUrl: "/path/to/pdf2.pdf",
        tags: ["IA", "Innovation", "Chirurgie"]
      }
    ]
  },
  {
    id: "2",
    volume: 2,
    date: "2023-12-20",
    description: "Dernier volume de 2023",
    articleCount: 10,
    downloadCount: 380,
    shareCount: 72,
    articles: [
      {
        id: "3",
        title: "Avancées en anesthésie régionale",
        abstract: "Les dernières innovations en matière d'anesthésie...",
        authors: ["Dr. Dubois", "Dr. Martin"],
        date: "2023-12-20",
        views: 85,
        citations: 12,
        downloads: 38,
        shares: 20,
        pageNumber: 1,
        volume: 2,
        pdfUrl: "/path/to/pdf3.pdf",
        tags: ["Anesthésie", "Innovation"]
      },
      {
        id: "4",
        title: "Techniques de suture avancées",
        abstract: "Nouvelles méthodes de suture pour améliorer la cicatrisation...",
        authors: ["Dr. Lambert", "Dr. Bernard"],
        date: "2023-12-15",
        views: 75,
        citations: 6,
        downloads: 28,
        shares: 15,
        pageNumber: 18,
        volume: 2,
        pdfUrl: "/path/to/pdf4.pdf",
        tags: ["Chirurgie", "Techniques"]
      }
    ]
  },
  {
    id: "3",
    volume: 3,
    date: "2023-11-25",
    description: "Volume spécial sur l'innovation chirurgicale",
    articleCount: 15,
    downloadCount: 520,
    shareCount: 95,
    articles: [
      {
        id: "5",
        title: "Robotique en chirurgie orthopédique",
        abstract: "Applications de la robotique en chirurgie orthopédique...",
        authors: ["Dr. Martin", "Dr. Lambert"],
        date: "2023-11-25",
        views: 150,
        citations: 25,
        downloads: 65,
        shares: 35,
        pageNumber: 1,
        volume: 3,
        pdfUrl: "/path/to/pdf5.pdf",
        tags: ["Robotique", "Orthopédie"]
      },
      {
        id: "6",
        title: "Chirurgie assistée par ordinateur",
        abstract: "L'évolution des systèmes de navigation chirurgicale...",
        authors: ["Dr. Bernard", "Dr. Dubois"],
        date: "2023-11-20",
        views: 130,
        citations: 18,
        downloads: 55,
        shares: 28,
        pageNumber: 25,
        volume: 3,
        pdfUrl: "/path/to/pdf6.pdf",
        tags: ["Innovation", "Technologie"]
      }
    ]
  }
];