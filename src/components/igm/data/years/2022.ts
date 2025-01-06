import type { Issue } from "../../types";

export const issues2022: Issue[] = [
  {
    id: "2022-12",
    title: "IGM Volume 6 - No 12",
    volume: "Volume 6",
    issue: "No 12",
    date: new Date(2022, 11, 15).toISOString(),
    abstract: "Perspectives pour 2023",
    pdfUrl: "https://example.com/sample2022-12.pdf",
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    articleCount: 8,
    downloads: 185,
    shares: 48,
    articles: [
      {
        id: "22-12-1",
        title: "Tendances médicales pour 2023",
        authors: ["Dr. Jean Martin", "Dr. Marie Rousseau"],
        pageNumber: 1,
        abstract: "Analyse des directions futures de la médecine",
        tags: ["Prospective", "Innovation"]
      }
    ]
  }
];