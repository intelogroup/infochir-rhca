import type { RhcaVolume } from "../../types";

export const volumes2022: RhcaVolume[] = [
  {
    id: "2022-12",
    volume: 12,
    date: "2022-12-15",
    description: "Rétrospective annuelle",
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
        views: 320,
        citations: 45,
        downloads: 115,
        shares: 62,
        pageNumber: 1,
        volume: 12,
        pdfUrl: "/path/to/pdf19.pdf",
        tags: ["Rétrospective", "Innovation", "Chirurgie"]
      }
    ]
  },
  // Add entries for each month of 2022...
  {
    id: "2022-01",
    volume: 1,
    date: "2022-01-01",
    description: "Nouvelles perspectives chirurgicales",
    articleCount: 14,
    downloadCount: 460,
    shareCount: 98,
    articles: [
      {
        id: "22-01-1",
        title: "Tendances émergentes en chirurgie",
        abstract: "Analyse des nouvelles approches...",
        authors: ["Dr. Paul Bernard", "Dr. Claire Martin"],
        date: "2022-01-01",
        views: 275,
        citations: 32,
        downloads: 88,
        shares: 45,
        pageNumber: 1,
        volume: 1,
        pdfUrl: "/path/to/pdf20.pdf",
        tags: ["Tendances", "Innovation", "Chirurgie"]
      }
    ]
  }
];