import type { RhcaArticle } from "../types";

export const mockArticles: RhcaArticle[] = [
  {
    id: "1",
    title: "Advances in Surgical Techniques",
    abstract: "Recent developments in minimally invasive surgery...",
    authors: ["Dr. John Smith", "Dr. Jane Doe"],
    publicationDate: "2024-03-15",
    pdfUrl: "/path/to/pdf1.pdf",
    imageUrl: "/path/to/image1.jpg",
    views: 150,
    downloads: 45,
    shares: 23,
    citations: 12,
    pageNumber: 1,
    volume: "Volume 8",
    date: "2024-03-15",
    tags: ["Surgery", "Innovation"]
  },
  {
    id: "2",
    title: "New Approaches in Post-Operative Care",
    abstract: "Examining modern protocols for post-surgical recovery...",
    authors: ["Dr. Robert Johnson", "Dr. Maria Garcia"],
    publicationDate: "2024-03-10",
    pdfUrl: "/path/to/pdf2.pdf",
    imageUrl: "/path/to/image2.jpg",
    views: 120,
    downloads: 38,
    shares: 19,
    citations: 8,
    pageNumber: 15,
    volume: "Volume 8",
    date: "2024-03-10",
    tags: ["Post-Op", "Recovery"]
  }
];