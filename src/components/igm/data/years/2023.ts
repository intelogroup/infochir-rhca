import type { Issue } from "../../types";

export const issues2023: Issue[] = [
  {
    id: "2023-12",
    title: "IGM Volume 7 - No 12",
    volume: "Volume 7",
    issue: "No 12",
    date: new Date(2023, 11, 15).toISOString(),
    abstract: "Bilan annuel de la recherche médicale",
    pdfUrl: "https://example.com/sample2023-12.pdf",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    articleCount: 10,
    downloads: 220,
    shares: 65,
    articles: [
      {
        id: "23-12-1",
        title: "Rétrospective 2023 des avancées médicales",
        authors: ["Dr. Claire Dubois", "Dr. Marc Leblanc"],
        pageNumber: 1,
        abstract: "Synthèse des progrès majeurs de l'année",
        tags: ["Rétrospective", "Innovation"]
      }
    ]
  }
];