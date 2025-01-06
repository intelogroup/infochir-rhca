import type { RhcaVolume } from "../../types";

export const neurosurgeryVolumes: RhcaVolume[] = [
  {
    id: "8",
    volume: 8,
    date: "2024-01-15",
    description: "Avancées en neurochirurgie",
    articleCount: 14,
    downloadCount: 495,
    shareCount: 98,
    articles: [
      {
        id: "15",
        title: "Chirurgie éveillée des tumeurs cérébrales : nouvelles approches",
        abstract: "Analyse des protocoles innovants en chirurgie éveillée...",
        authors: ["Dr. Marc Dupont", "Dr. Claire Rousseau"],
        date: "2024-01-15",
        views: "276",
        citations: "32",
        downloads: "92",
        shares: "48",
        pageNumber: "1",
        volume: "8",
        pdfUrl: "/path/to/pdf15.pdf",
        tags: ["Neurochirurgie", "Tumeurs cérébrales", "Innovation"],
        publicationDate: "2024-01-15",
        specialty: "Neurochirurgie"
      },
      {
        id: "16",
        title: "Navigation peropératoire en neurochirurgie spinale",
        abstract: "Applications des systèmes de navigation 3D en chirurgie rachidienne...",
        authors: ["Dr. Thomas Martin", "Dr. Anne Lefebvre"],
        date: "2024-01-15",
        views: "234",
        citations: "26",
        downloads: "84",
        shares: "39",
        pageNumber: "18",
        volume: "8",
        pdfUrl: "/path/to/pdf16.pdf",
        tags: ["Neurochirurgie", "Navigation", "Rachis"],
        publicationDate: "2024-01-15",
        specialty: "Neurochirurgie"
      }
    ],
    coverImage: "/placeholder.svg"
  }
];