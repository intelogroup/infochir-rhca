
import type { RhcaVolume } from "../../types";

export const volumes2022: RhcaVolume[] = [
  {
    id: "2022-12",
    volume: 12,
    date: "2022-12-15",
    description: "Rétrospective 2022",
    articleCount: 16,
    downloadCount: 580,
    shareCount: 120,
    articles: [
      {
        id: "22-12-1",
        title: "Bilan des avancées chirurgicales 2022",
        abstract: "Synthèse des innovations majeures en chirurgie au cours de l'année 2022...",
        authors: ["Dr. Jean Alouidor", "Dr. Marie-Claire Dubois"],
        date: "2022-12-15",
        views: 320,
        citations: 45,
        downloads: 115,
        shares: 62,
        pageNumber: "1",
        volume: "12",
        tags: ["Rétrospective", "Innovation", "IA"],
        publicationDate: "2022-12-15",
        specialty: "Chirurgie générale",
        imageUrl: "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=format",
        source: "RHCA",
        pdfFileName: "RHCA_2022_12_bilan_annuel.pdf"
      }
    ],
    coverImage: "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=format"
  }
];
