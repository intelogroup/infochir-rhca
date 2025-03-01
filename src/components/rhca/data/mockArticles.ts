
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
  },
  {
    id: "2",
    title: "Approches thérapeutiques des tumeurs hématologiques",
    abstract: "Revue systématique des nouvelles approches de traitement pour les tumeurs hématologiques.",
    authors: ["Dr. Sophie Martin", "Dr. Thomas Petit"],
    publicationDate: new Date(2025, 0, 8).toISOString(), // January 8, 2025
    date: new Date(2025, 0, 8).toISOString(),
    specialty: "Hématologie",
    category: "Oncologie",
    source: "RHCA",
    volume: "04",
    issue: "48",
    pageNumber: 8,
    views: 312,
    downloads: 156,
    shares: 28,
    citations: 7,
    tags: ["Hématologie", "Oncologie", "Tumeurs", "Thérapeutique"],
    imageUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_04_no_48_08_1_2025.jpg`,
    pdfUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/RHCA_vol_04_no_48_08_1_2025.pdf`,
    status: "published",
    institution: "Institut Gustave Roussy",
    articleType: "RHCA",
    pdfFileName: "RHCA_vol_04_no_48_08_1_2025.pdf"
  },
  {
    id: "3",
    title: "Prise en charge des infections nosocomiales en réanimation",
    abstract: "Analyse des protocoles récents pour la gestion des infections nosocomiales en service de réanimation.",
    authors: ["Dr. Philippe Durand", "Dr. Claire Leroy"],
    publicationDate: new Date(2024, 11, 15).toISOString(), // December 15, 2024
    date: new Date(2024, 11, 15).toISOString(),
    specialty: "Infectiologie",
    category: "Réanimation",
    source: "RHCA",
    volume: "04",
    issue: "47",
    pageNumber: 23,
    views: 189,
    downloads: 62,
    shares: 11,
    citations: 2,
    tags: ["Infectiologie", "Réanimation", "Nosocomial", "Antibiotiques"],
    imageUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_04_no_47_15_12_2024.jpg`,
    pdfUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/RHCA_vol_04_no_47_15_12_2024.pdf`,
    status: "published",
    institution: "Hôpital de la Pitié-Salpêtrière",
    articleType: "RHCA",
    pdfFileName: "RHCA_vol_04_no_47_15_12_2024.pdf"
  }
];
