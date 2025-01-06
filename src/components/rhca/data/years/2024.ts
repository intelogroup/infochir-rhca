import type { RhcaVolume } from "../../types";

export const volumes2024: RhcaVolume[] = [
  {
    id: "2024-01",
    volume: 8,
    date: "2024-01-15",
    description: "Innovations en chirurgie mini-invasive",
    articleCount: 14,
    downloadCount: 495,
    shareCount: 98,
    articles: [
      {
        id: "24-01-1",
        title: "Nouvelles approches en chirurgie laparoscopique avancée",
        abstract: "Analyse des techniques innovantes...",
        authors: ["Dr. Marc Dupont", "Dr. Claire Rousseau"],
        date: "2024-01-15",
        views: 276,
        citations: 32,
        downloads: 92,
        shares: 48,
        pageNumber: 1,
        volume: 8,
        pdfUrl: "/path/to/pdf15.pdf",
        tags: ["Chirurgie mini-invasive", "Laparoscopie", "Innovation"]
      }
    ]
  },
  {
    id: "2024-02",
    volume: 9,
    date: "2024-02-01",
    description: "Avancées en anesthésiologie",
    articleCount: 12,
    downloadCount: 380,
    shareCount: 85,
    articles: [
      {
        id: "24-02-1",
        title: "Protocoles d'anesthésie personnalisés",
        abstract: "Étude sur l'optimisation des protocoles...",
        authors: ["Dr. Sophie Martin", "Dr. Paul Dubois"],
        date: "2024-02-01",
        views: 220,
        citations: 28,
        downloads: 75,
        shares: 42,
        pageNumber: 1,
        volume: 9,
        pdfUrl: "/path/to/pdf16.pdf",
        tags: ["Anesthésie", "Protocoles", "Personnalisation"]
      }
    ]
  }
];