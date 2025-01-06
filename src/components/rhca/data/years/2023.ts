import type { RhcaVolume } from "../../types";

export const volumes2023: RhcaVolume[] = [
  {
    id: "2023-12",
    volume: 7,
    date: "2023-12-15",
    description: "Focus sur la chirurgie pédiatrique",
    articleCount: 15,
    downloadCount: 520,
    shareCount: 105,
    articles: [
      {
        id: "23-12-1",
        title: "Innovations en chirurgie pédiatrique mini-invasive",
        abstract: "Revue des dernières avancées...",
        authors: ["Dr. Marie Lambert", "Dr. Jean-Marc Bernard"],
        date: "2023-12-15",
        views: 245,
        citations: 28,
        downloads: 86,
        shares: 43,
        pageNumber: 1,
        volume: 7,
        pdfUrl: "/path/to/pdf17.pdf",
        tags: ["Pédiatrie", "Mini-invasif", "Innovation"]
      }
    ]
  },
  // Add entries for each month of 2023...
  {
    id: "2023-01",
    volume: 1,
    date: "2023-01-01",
    description: "Chirurgie cardiaque moderne",
    articleCount: 13,
    downloadCount: 450,
    shareCount: 95,
    articles: [
      {
        id: "23-01-1",
        title: "Nouvelles approches en chirurgie valvulaire",
        abstract: "État de l'art des techniques modernes...",
        authors: ["Dr. Pierre Martin", "Dr. Sophie Dubois"],
        date: "2023-01-01",
        views: 280,
        citations: 35,
        downloads: 92,
        shares: 48,
        pageNumber: 1,
        volume: 1,
        pdfUrl: "/path/to/pdf18.pdf",
        tags: ["Cardiaque", "Valvulaire", "Innovation"]
      }
    ]
  }
];