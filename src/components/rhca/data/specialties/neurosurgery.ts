
import { RhcaArticle } from "../../types";

export const neurosurgeryArticles: RhcaArticle[] = [
  {
    id: "neuro-1",
    title: "Advances in Brain Surgery",
    abstract: "Latest developments in neurosurgical procedures...",
    authors: ["Dr. Smith", "Dr. Johnson"],
    publicationDate: "2024-01-15",
    date: "2024-01-15",
    specialty: "Neurosurgery",
    source: "RHCA",
    volume: "12",
    pageNumber: 1,
    views: 150,
    downloads: 75,
    shares: 30,
    citations: 12,
    tags: ["brain", "surgery", "neurosurgery"],
    imageUrl: "/images/brain.jpg",
    pdfUrl: "/pdfs/brain-surgery-2024.pdf",
    status: "published"
  },
  {
    id: "neuro-2",
    title: "Modern Approaches to Spine Surgery",
    abstract: "Exploring new techniques in spinal procedures...",
    authors: ["Dr. Wilson", "Dr. Brown"],
    publicationDate: "2024-01-10",
    date: "2024-01-10",
    specialty: "Neurosurgery",
    source: "RHCA",
    volume: "12",
    pageNumber: 15,
    views: 200,
    downloads: 100,
    shares: 45,
    citations: 8,
    tags: ["spine", "surgery", "neurosurgery"],
    imageUrl: "/images/spine.jpg",
    pdfUrl: "/pdfs/spine-surgery-2024.pdf",
    status: "published"
  }
];
