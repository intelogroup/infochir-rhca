
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
        abstract: "Synthèse des progrès majeurs en chirurgie au cours de l'année, avec focus sur les innovations technologiques...",
        authors: ["Dr. Marie Lambert", "Dr. Jean-Marc Bernard"],
        date: "2023-12-15",
        views: 245,
        citations: 28,
        downloads: 86,
        shares: 43,
        pageNumber: "1",
        volume: "12",
        tags: ["Rétrospective", "Innovation"],
        publicationDate: "2023-12-15",
        specialty: "Chirurgie générale",
        imageUrl: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=format",
        source: "RHCA",
        pdfFileName: "RHCA_2023_12_retrospective_chirurgicale.pdf"
      }
    ],
    coverImage: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=format"
  }
];
