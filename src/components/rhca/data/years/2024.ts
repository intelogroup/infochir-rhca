
import type { RhcaVolume } from "../../types";

export const volumes2024: RhcaVolume[] = [
  {
    id: "2024-1",
    volume: "14",
    date: "2024-01-05",
    description: "Latest Surgical Techniques",
    articleCount: 15,
    downloadCount: 520,
    shareCount: 105,
    articles: [
      {
        id: "24-1",
        title: "Latest Surgical Techniques",
        abstract: "Comprehensive review of modern surgical approaches...",
        authors: ["Dr. White", "Dr. Miller"],
        date: "2024-01-05",
        publicationDate: "2024-01-05",
        specialty: "General Surgery",
        source: "RHCA",
        volume: "14",
        pageNumber: 1,
        views: 250,
        downloads: 120,
        shares: 60,
        citations: 20,
        tags: ["surgery", "techniques", "modern"],
        imageUrl: "/images/surgery.jpg",
        pdfUrl: "/pdfs/surgical-techniques-2024.pdf",
        status: "published"
      }
    ],
    coverImage: "/images/surgery.jpg"
  }
];
