import type { RhcaVolume } from "../../types";

export const cardiologyVolumes: RhcaVolume[] = [
  {
    id: "7",
    volume: 7,
    date: "2024-02-01",
    description: "Innovations en chirurgie cardiaque",
    articleCount: 16,
    downloadCount: 580,
    shareCount: 120,
    articles: [
      {
        id: "13",
        title: "Nouvelles approches en chirurgie valvulaire mini-invasive",
        abstract: "Évaluation des techniques innovantes en chirurgie valvulaire minimalement invasive...",
        authors: ["Dr. Marie-Claire Dubois", "Dr. Jean-Paul Martin"],
        date: "2024-02-01",
        publicationDate: "2024-02-01",
        views: 245,
        citations: 28,
        downloads: 85,
        shares: 42,
        pageNumber: "1",
        volume: "7",
        pdfUrl: "/path/to/pdf13.pdf",
        tags: ["Chirurgie cardiaque", "Mini-invasif", "Innovation"],
        source: "RHCA",
        specialty: "Cardiologie"
      },
      {
        id: "14",
        title: "Assistance circulatoire mécanique : état de l'art",
        abstract: "Revue des dispositifs d'assistance circulatoire de dernière génération...",
        authors: ["Dr. Pierre Lambert", "Dr. Sophie Bernard"],
        date: "2024-02-01",
        views: 198,
        citations: 22,
        downloads: 76,
        shares: 35,
        pageNumber: "20",
        volume: "7",
        pdfUrl: "/path/to/pdf14.pdf",
        tags: ["Assistance circulatoire", "Technologie", "Cardiologie"],
        publicationDate: "2024-02-01",
        specialty: "Cardiologie"
      }
    ]
  }
];
