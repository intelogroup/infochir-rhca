
import type { RhcaArticle } from "../../types";

export const cardiologyArticles: RhcaArticle[] = [
  {
    id: "card-1",
    title: "Innovations in Cardiac Surgery",
    abstract: "Latest developments in cardiac surgical procedures...",
    authors: ["Dr. Jane Smith", "Dr. John Doe"],
    publicationDate: "2024-01-15",
    date: "2024-01-15",
    specialty: "Cardiology",
    category: "Research",
    source: "RHCA",
    volume: "12",
    pageNumber: 1,
    views: 250,
    downloads: 120,
    shares: 45,
    citations: 15,
    tags: ["cardiac surgery", "innovation", "research"],
    imageUrl: "/images/cardiac-surgery.jpg",
    pdfUrl: "/pdfs/cardiac-innovations-2024.pdf",
    pdfFileName: "cardiac-innovations-2024.pdf"
  }
];

export const cardiologyVolumes = [{
  id: "cv-2024-1",
  volume: "12",
  date: "2024-01",
  description: "Cardiology advances in 2024",
  articleCount: 15,
  downloadCount: 450,
  shareCount: 200,
  articles: cardiologyArticles,
  coverImage: "/images/cardiology-cover.jpg"
}];
