
import { RhcaArticle } from "../types";
import { formatDateForFilename } from "@/lib/utils";

// Create a date for our consistent filename pattern (DD_MM_YYYY)
const currentDate = new Date();
const formattedDate = formatDateForFilename(currentDate);

export const mockRhcaArticles: RhcaArticle[] = [
  {
    id: "1",
    title: "Traitement chirurgical d'une fracture du calcanéum",
    abstract: "Étude de cas d'une technique chirurgicale innovante pour les fractures complexes du calcanéum.",
    authors: ["Dr. Jean Dupont", "Dr. Marie Laurent"],
    publicationDate: new Date(2025, 0, 14).toISOString(), // January 14, 2025
    date: new Date(2025, 0, 14).toISOString(),
    specialty: "Orthopédie",
    category: "Chirurgie",
    source: "RHCA",
    volume: "04",
    issue: "49",
    pageNumber: 12,
    views: 245,
    downloads: 78,
    shares: 14,
    citations: 3,
    tags: ["Orthopédie", "Fracture", "Calcanéum", "Chirurgie"],
    imageUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_04_no_49_14_1_2025.jpg`,
    pdfUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/RHCA_vol_04_no_49_14_1_2025.pdf`,
    status: "published",
    institution: "CHU de Bordeaux",
    articleType: "RHCA",
    pdfFileName: "RHCA_vol_04_no_49_14_1_2025.pdf"
  }
];
