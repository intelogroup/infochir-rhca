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
  },
  {
    id: "2023-11",
    title: "IGM Volume 7 - No 11",
    volume: "Volume 7",
    issue: "No 11",
    date: new Date(2023, 10, 15).toISOString(),
    abstract: "Progrès en neurologie",
    pdfUrl: "https://example.com/sample2023-11.pdf",
    coverImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc",
    articleCount: 8,
    downloads: 178,
    shares: 42,
    articles: [
      {
        id: "23-11-1",
        title: "Nouvelles approches thérapeutiques",
        authors: ["Dr. Antoine Dupont", "Dr. Marie Leclerc"],
        pageNumber: 1,
        abstract: "Traitements innovants en neurologie",
        tags: ["Neurologie", "Thérapie"]
      }
    ]
  },
  {
    id: "2023-10",
    title: "IGM Volume 7 - No 10",
    volume: "Volume 7",
    issue: "No 10",
    date: new Date(2023, 9, 15).toISOString(),
    abstract: "Actualités en pédiatrie",
    pdfUrl: "https://example.com/sample2023-10.pdf",
    coverImage: "https://images.unsplash.com/photo-1584515933487-779824d29309",
    articleCount: 9,
    downloads: 195,
    shares: 51,
    articles: [
      {
        id: "23-10-1",
        title: "Développements récents en pédiatrie",
        authors: ["Dr. Sophie Martin", "Dr. Paul Richard"],
        pageNumber: 1,
        abstract: "Nouvelles approches en pédiatrie",
        tags: ["Pédiatrie", "Innovation"]
      }
    ]
  }
];