
import type { RhcaVolume } from "../../types";

export const volumes2021: RhcaVolume[] = [
  {
    id: "2021-12",
    volume: 12,
    date: "2021-12-15",
    description: "Rétrospective 2021",
    articleCount: 15,
    downloadCount: 550,
    shareCount: 110,
    articles: [
      {
        id: "21-12-1",
        title: "Bilan annuel de la chirurgie 2021",
        abstract: "Revue des avancées majeures en chirurgie au cours de l'année 2021...",
        authors: ["Dr. Marc Antoine", "Dr. Julie Pierre"],
        date: "2021-12-15",
        views: 310,
        citations: 42,
        downloads: 105,
        shares: 58,
        pageNumber: "1-15",
        volume: "12",
        tags: ["Rétrospective", "Bilan", "Innovation"],
        publicationDate: "2021-12-15",
        specialty: "Chirurgie générale",
        source: "RHCA",
        imageUrl: "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=format"
      }
    ],
    coverImage: "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=format"
  }
];
