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
        abstract: "Synthèse des innovations majeures...",
        authors: ["Dr. Jean Alouidor", "Dr. Marie-Claire Dubois"],
        date: "2022-12-15",
        views: "320",
        citations: "45",
        downloads: "115",
        shares: "62",
        pageNumber: "1",
        volume: "12",
        tags: ["Rétrospective", "Innovation"],
        publicationDate: "2022-12-15",
        specialty: "Chirurgie générale"
      }
    ],
    coverImage: "/placeholder.svg"
  },
  {
    id: "2022-11",
    volume: 11,
    date: "2022-11-15",
    description: "Chirurgie orthopédique",
    articleCount: 14,
    downloadCount: 520,
    shareCount: 105,
    articles: [
      {
        id: "22-11-1",
        title: "Avancées en chirurgie orthopédique",
        abstract: "Nouvelles techniques de reconstruction...",
        authors: ["Dr. Michel Blanc", "Dr. Anne Noir"],
        date: "2022-11-15",
        views: "290",
        citations: "38",
        downloads: "98",
        shares: "52",
        pageNumber: "1",
        volume: "11",
        tags: ["Orthopédie", "Innovation"],
        publicationDate: "2022-11-15",
        specialty: "Orthopédie"
      }
    ],
    coverImage: "/placeholder.svg"
  },
  {
    id: "2022-01",
    volume: 1,
    date: "2022-01-15",
    description: "Chirurgie générale",
    articleCount: 13,
    downloadCount: 460,
    shareCount: 98,
    articles: [
      {
        id: "22-01-1",
        title: "Tendances en chirurgie générale",
        abstract: "Analyse des nouvelles approches...",
        authors: ["Dr. Paul Bernard", "Dr. Claire Martin"],
        date: "2022-01-15",
        views: "275",
        citations: "32",
        downloads: "88",
        shares: "45",
        pageNumber: "1",
        volume: "1",
        tags: ["Chirurgie générale", "Innovation"],
        publicationDate: "2022-01-15",
        specialty: "Chirurgie générale"
      }
    ],
    coverImage: "/placeholder.svg"
  }
];