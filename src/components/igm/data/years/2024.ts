import type { Issue } from "../../types";

export const issues2024: Issue[] = [
  {
    id: "2024-03",
    title: "IGM Volume 8 - No 3",
    volume: "Volume 8",
    issue: "No 3",
    date: new Date(2024, 2, 15).toISOString(),
    abstract: "Innovations en chirurgie cardiaque et nouvelles approches thérapeutiques",
    pdfUrl: "https://example.com/sample2024-03.pdf",
    coverImage: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e",
    articleCount: 7,
    downloads: 145,
    shares: 38,
    articles: [
      {
        id: "24-03-1",
        title: "Nouvelles techniques chirurgicales",
        authors: ["Dr. Thomas Martin", "Dr. Sarah Johnson"],
        pageNumber: 1,
        abstract: "Avancées en chirurgie mini-invasive",
        tags: ["Chirurgie", "Innovation"]
      }
    ]
  },
  {
    id: "2024-02",
    title: "IGM Volume 8 - No 2",
    volume: "Volume 8",
    issue: "No 2",
    date: new Date(2024, 1, 15).toISOString(),
    abstract: "Avancées en médecine d'urgence et protocoles actualisés",
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
    abstract: "Innovation en imagerie médicale et applications de l'IA",
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
  },
  {
    id: "2024-04",
    title: "IGM Volume 8 - No 4",
    volume: "Volume 8",
    issue: "No 4",
    date: new Date(2024, 3, 15).toISOString(),
    abstract: "Dernières avancées en neurochirurgie et techniques innovantes",
    pdfUrl: "https://example.com/sample2024-04.pdf",
    coverImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
    articleCount: 6,
    downloads: 120,
    shares: 35,
    articles: [
      {
        id: "24-04-1",
        title: "Innovations en neurochirurgie",
        authors: ["Dr. Philippe Martin", "Dr. Claire Dubois"],
        pageNumber: 1,
        abstract: "Nouvelles approches en chirurgie cérébrale",
        tags: ["Neurochirurgie", "Innovation"]
      }
    ]
  },
  {
    id: "2024-05",
    title: "IGM Volume 8 - No 5",
    volume: "Volume 8",
    issue: "No 5",
    date: new Date(2024, 4, 15).toISOString(),
    abstract: "Progrès en chirurgie orthopédique et rééducation",
    pdfUrl: "https://example.com/sample2024-05.pdf",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
    articleCount: 8,
    downloads: 165,
    shares: 42,
    articles: [
      {
        id: "24-05-1",
        title: "Nouvelles prothèses intelligentes",
        authors: ["Dr. Marc Bernard", "Dr. Julie Lambert"],
        pageNumber: 1,
        abstract: "Innovations en prothétique orthopédique",
        tags: ["Orthopédie", "Prothèses"]
      }
    ]
  }
];