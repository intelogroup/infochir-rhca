
import type { RhcaVolume } from "../../types";

export const pediatricVolumes: RhcaVolume[] = [
  {
    id: "9",
    volume: "9",
    date: "2024-01-01",
    description: "Chirurgie pédiatrique moderne",
    articleCount: 15,
    downloadCount: 520,
    shareCount: 105,
    articles: [
      {
        id: "17",
        title: "Chirurgie mini-invasive en pédiatrie : expérience sur 500 cas",
        abstract: "Analyse rétrospective des interventions mini-invasives en chirurgie pédiatrique...",
        authors: ["Dr. Sophie Martin", "Dr. Paul Dubois"],
        date: "2024-01-01",
        views: 289,
        citations: 35,
        downloads: 98,
        shares: 52,
        pageNumber: 1,
        volume: "9",
        tags: ["Pédiatrie", "Mini-invasif", "Étude de cas"],
        publicationDate: "2024-01-01",
        specialty: "Pédiatrie",
        source: "RHCA"
      }
    ],
    coverImage: "/placeholder.svg"
  }
];
