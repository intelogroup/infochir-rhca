
import type { RhcaArticle } from "../types";

export const mockArticles: RhcaArticle[] = [
  {
    id: "1",
    title: "Advances in Cardiac Surgery",
    abstract: "Recent developments in minimally invasive cardiac procedures...",
    authors: ["Dr. Smith", "Dr. Johnson"],
    publicationDate: "2024-01-15",
    date: "2024-01-15",
    specialty: "Cardiology",
    category: "Research",
    source: "RHCA",
    volume: "12",
    pageNumber: 1,
    views: 150,
    downloads: 75,
    shares: 30,
    citations: 12,
    tags: ["cardiac", "surgery", "minimally invasive"],
    imageUrl: "/images/cardiac.jpg",
    pdfUrl: "/pdfs/cardiac-surgery-2024.pdf",
    pdfFileName: "cardiac-surgery-2024.pdf"
  },
  {
    id: "2",
    title: "Modern Approaches to Orthopedic Surgery",
    abstract: "Exploring new techniques in joint replacement...",
    authors: ["Dr. Wilson", "Dr. Brown"],
    publicationDate: "2024-01-10",
    date: "2024-01-10",
    specialty: "Orthopedics",
    category: "Clinical Study",
    source: "RHCA",
    volume: "12",
    pageNumber: 15,
    views: 200,
    downloads: 100,
    shares: 45,
    citations: 8,
    tags: ["orthopedics", "joint replacement"],
    imageUrl: "/images/ortho.jpg",
    pdfUrl: "/pdfs/orthopedic-approaches-2024.pdf",
    pdfFileName: "orthopedic-approaches-2024.pdf"
  }
];
