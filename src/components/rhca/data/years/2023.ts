import type { RhcaVolume } from "../../types";

export const volumes2023: RhcaVolume[] = [
  {
    id: "2023-12",
    volume: 12,
    date: "2023-12-15",
    description: "Bilan annuel de la chirurgie",
    articleCount: 15,
    downloadCount: 520,
    shareCount: 105,
    articles: [
      {
        id: "23-12-1",
        title: "Rétrospective 2023 des avancées chirurgicales",
        abstract: "Synthèse des progrès majeurs...",
        authors: ["Dr. Marie Lambert", "Dr. Jean-Marc Bernard"],
        date: "2023-12-15",
        views: 245,
        citations: 28,
        downloads: 86,
        shares: 43,
        pageNumber: 1,
        volume: 12,
        tags: ["Rétrospective", "Innovation"]
      }
    ]
  },
  // Add entries for each month of 2023 (11 to 1)
  {
    id: "2023-11",
    volume: 11,
    date: "2023-11-15",
    description: "Chirurgie pédiatrique",
    articleCount: 14,
    downloadCount: 480,
    shareCount: 95,
    articles: [
      {
        id: "23-11-1",
        title: "Nouvelles approches en chirurgie pédiatrique",
        abstract: "Innovations dans le domaine...",
        authors: ["Dr. Claire Martin", "Dr. Paul Robert"],
        date: "2023-11-15",
        views: 230,
        citations: 25,
        downloads: 82,
        shares: 40,
        pageNumber: 1,
        volume: 11,
        tags: ["Pédiatrie", "Innovation"]
      }
    ]
  },
  // Continue with months 10 through 1...
  {
    id: "2023-01",
    volume: 1,
    date: "2023-01-15",
    description: "Chirurgie cardiaque",
    articleCount: 13,
    downloadCount: 450,
    shareCount: 95,
    articles: [
      {
        id: "23-01-1",
        title: "Innovations en chirurgie cardiaque",
        abstract: "État de l'art des techniques modernes...",
        authors: ["Dr. Pierre Martin", "Dr. Sophie Dubois"],
        date: "2023-01-15",
        views: 280,
        citations: 35,
        downloads: 92,
        shares: 48,
        pageNumber: 1,
        volume: 1,
        tags: ["Cardiaque", "Innovation"]
      }
    ]
  }
];