
import type { RhcaVolume } from "../../types";

export const volumes2024: RhcaVolume[] = [
  {
    id: "2024-03",
    volume: 3,
    date: "2024-03-15",
    description: "Premier trimestre 2024",
    articleCount: 12,
    downloadCount: 320,
    shareCount: 85,
    articles: [
      {
        id: "24-03-1",
        title: "Les avancées du premier trimestre 2024",
        abstract: "Synthèse des innovations et développements majeurs en chirurgie pour le début de l'année 2024...",
        authors: ["Dr. Marie Lambert", "Dr. Pierre Dubois"],
        date: "2024-03-15",
        views: 180,
        citations: 15,
        downloads: 65,
        shares: 32,
        pageNumber: "1",
        volume: "3",
        tags: ["Innovation", "Techniques", "2024"],
        publicationDate: "2024-03-15",
        specialty: "Chirurgie générale",
        imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&auto=format",
        source: "RHCA",
        pdfFileName: "RHCA-2024-Vol3.pdf"
      }
    ],
    coverImage: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&auto=format"
  }
];
