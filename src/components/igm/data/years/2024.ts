import type { Issue } from "../../types";

export const issues2024: Issue[] = [
  {
    id: "2024-02",
    title: "IGM Volume 8 - No 2",
    volume: "Volume 8",
    issue: "No 2",
    date: new Date(2024, 1, 15).toISOString(),
    abstract: "Avancées en médecine d'urgence",
    pdfUrl: "https://example.com/sample2024-02.pdf",
    coverImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514",
    articleCount: 8,
    downloads: 180,
    shares: 45,
    articles: [
      {
        id: "24-02-1",
        title: "Protocoles d'urgence actualisés",
        authors: ["Dr. Marie Laurent", "Dr. Pierre Dubois"],
        pageNumber: 1,
        abstract: "Mise à jour des protocoles de prise en charge",
        tags: ["Urgences", "Protocoles"]
      }
    ]
  },
  {
    id: "2024-01",
    title: "IGM Volume 8 - No 1",
    volume: "Volume 8",
    issue: "No 1",
    date: new Date(2024, 0, 15).toISOString(),
    abstract: "Innovation en imagerie médicale",
    pdfUrl: "https://example.com/sample2024-01.pdf",
    coverImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557",
    articleCount: 9,
    downloads: 195,
    shares: 52,
    articles: [
      {
        id: "24-01-1",
        title: "Intelligence artificielle en radiologie",
        authors: ["Dr. Sophie Martin", "Dr. Jean-Paul Berger"],
        pageNumber: 1,
        abstract: "Applications de l'IA en imagerie médicale",
        tags: ["Radiologie", "IA"]
      }
    ]
  }
];