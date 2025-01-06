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
        abstract: "Revue des avancées majeures...",
        authors: ["Dr. Marc Antoine", "Dr. Julie Pierre"],
        date: "2021-12-15",
        views: 310,
        citations: 42,
        downloads: 105,
        shares: 58,
        pageNumber: 1,
        volume: 12,
        tags: ["Rétrospective", "Bilan"]
      }
    ]
  },
  // Add entries for each month of 2021 (11 to 1)
  {
    id: "2021-01",
    volume: 1,
    date: "2021-01-15",
    description: "Chirurgie d'urgence",
    articleCount: 12,
    downloadCount: 420,
    shareCount: 85,
    articles: [
      {
        id: "21-01-1",
        title: "Protocoles en chirurgie d'urgence",
        abstract: "Mise à jour des protocoles...",
        authors: ["Dr. Pierre Louis", "Dr. Marie Joseph"],
        date: "2021-01-15",
        views: 260,
        citations: 28,
        downloads: 78,
        shares: 42,
        pageNumber: 1,
        volume: 1,
        tags: ["Urgence", "Protocoles"]
      }
    ]
  }
];