import type { Issue } from "../../types";

export const issues2022: Issue[] = [
  {
    id: "2022-12",
    title: "IGM Volume 6 - No 12",
    volume: "Volume 6",
    issue: "No 12",
    date: new Date(2022, 11, 15).toISOString(),
    abstract: "Perspectives pour 2023 et innovations médicales",
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
  },
  {
    id: "2022-11",
    title: "IGM Volume 6 - No 11",
    volume: "Volume 6",
    issue: "No 11",
    date: new Date(2022, 10, 15).toISOString(),
    abstract: "Progrès en chirurgie digestive",
    pdfUrl: "https://example.com/sample2022-11.pdf",
    coverImage: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0",
    articleCount: 7,
    downloads: 165,
    shares: 42,
    articles: [
      {
        id: "22-11-1",
        title: "Innovations en chirurgie digestive",
        authors: ["Dr. Philippe Dubois", "Dr. Claire Martin"],
        pageNumber: 1,
        abstract: "Nouvelles techniques en chirurgie digestive",
        tags: ["Chirurgie digestive", "Innovation"]
      }
    ]
  },
  {
    id: "2022-10",
    title: "IGM Volume 6 - No 10",
    volume: "Volume 6",
    issue: "No 10",
    date: new Date(2022, 9, 15).toISOString(),
    abstract: "Actualités en gynécologie obstétrique",
    pdfUrl: "https://example.com/sample2022-10.pdf",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    articleCount: 9,
    downloads: 195,
    shares: 50,
    articles: [
      {
        id: "22-10-1",
        title: "Avancées en obstétrique",
        authors: ["Dr. Marie-Claire Lambert", "Dr. Jean Dupont"],
        pageNumber: 1,
        abstract: "Nouvelles approches en gynécologie",
        tags: ["Gynécologie", "Obstétrique"]
      }
    ]
  },
  {
    id: "2022-09",
    title: "IGM Volume 6 - No 9",
    volume: "Volume 6",
    issue: "No 9",
    date: new Date(2022, 8, 15).toISOString(),
    abstract: "Innovations en dermatologie",
    pdfUrl: "https://example.com/sample2022-09.pdf",
    coverImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982",
    articleCount: 6,
    downloads: 155,
    shares: 38,
    articles: [
      {
        id: "22-09-1",
        title: "Nouvelles thérapies dermatologiques",
        authors: ["Dr. Sophie Bernard", "Dr. Pierre Martin"],
        pageNumber: 1,
        abstract: "Innovations en dermatologie clinique",
        tags: ["Dermatologie", "Thérapie"]
      }
    ]
  },
  {
    id: "2022-08",
    title: "IGM Volume 6 - No 8",
    volume: "Volume 6",
    issue: "No 8",
    date: new Date(2022, 7, 15).toISOString(),
    abstract: "Progrès en ophtalmologie",
    pdfUrl: "https://example.com/sample2022-08.pdf",
    coverImage: "https://images.unsplash.com/photo-1579165466741-7f35e4755660",
    articleCount: 7,
    downloads: 175,
    shares: 44,
    articles: [
      {
        id: "22-08-1",
        title: "Innovations en chirurgie oculaire",
        authors: ["Dr. Marc Durand", "Dr. Julie Lambert"],
        pageNumber: 1,
        abstract: "Nouvelles techniques en ophtalmologie",
        tags: ["Ophtalmologie", "Chirurgie"]
      }
    ]
  }
];