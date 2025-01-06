import type { Issue } from "../../types";

export const issues2023: Issue[] = [
  {
    id: "2023-12",
    title: "IGM Volume 7 - No 12",
    volume: "Volume 7",
    issue: "No 12",
    date: new Date(2023, 11, 15).toISOString(),
    abstract: "Bilan annuel de la recherche médicale et perspectives futures",
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
    abstract: "Progrès en neurologie et nouvelles thérapies",
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
    abstract: "Actualités en pédiatrie et soins néonataux",
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
  },
  {
    id: "2023-09",
    title: "IGM Volume 7 - No 9",
    volume: "Volume 7",
    issue: "No 9",
    date: new Date(2023, 8, 15).toISOString(),
    abstract: "Innovations en chirurgie plastique et reconstructive",
    pdfUrl: "https://example.com/sample2023-09.pdf",
    coverImage: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843",
    articleCount: 7,
    downloads: 165,
    shares: 38,
    articles: [
      {
        id: "23-09-1",
        title: "Techniques de reconstruction avancées",
        authors: ["Dr. Laurent Martin", "Dr. Marie-Claire Dubois"],
        pageNumber: 1,
        abstract: "Nouvelles approches en chirurgie reconstructive",
        tags: ["Chirurgie plastique", "Reconstruction"]
      }
    ]
  },
  {
    id: "2023-08",
    title: "IGM Volume 7 - No 8",
    volume: "Volume 7",
    issue: "No 8",
    date: new Date(2023, 7, 15).toISOString(),
    abstract: "Avancées en cardiologie interventionnelle",
    pdfUrl: "https://example.com/sample2023-08.pdf",
    coverImage: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd",
    articleCount: 8,
    downloads: 185,
    shares: 45,
    articles: [
      {
        id: "23-08-1",
        title: "Nouvelles techniques d'intervention cardiaque",
        authors: ["Dr. Pierre Dumont", "Dr. Sophie Lambert"],
        pageNumber: 1,
        abstract: "Innovations en cardiologie interventionnelle",
        tags: ["Cardiologie", "Intervention"]
      }
    ]
  }
];