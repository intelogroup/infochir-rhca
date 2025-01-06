import type { RhcaVolume } from "../../types";

export const orthopedicsVolumes: RhcaVolume[] = [
  {
    id: "10",
    volume: 10,
    date: "2024-03-01",
    description: "Innovations en chirurgie orthopédique",
    articleCount: 14,
    downloadCount: 480,
    shareCount: 95,
    articles: [
      {
        id: "19",
        title: "Chirurgie assistée par robot en orthopédie",
        abstract: "Applications actuelles et perspectives...",
        authors: ["Dr. Michel Blanc", "Dr. Sarah Noir"],
        date: "2024-03-01",
        views: 265,
        citations: 30,
        downloads: 88,
        shares: 46,
        pageNumber: 1,
        volume: 10,
        tags: ["Orthopédie", "Robotique", "Innovation"]
      }
    ]
  }
];