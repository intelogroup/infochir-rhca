
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
    title: "Analyse des manifestations neurologiques post-COVID",
    abstract: "Revue des complications neurologiques observées chez les patients après infection au SARS-CoV-2.",
    authors: ["Dr. Amina Benali", "Dr. Lucas Moreau", "Dr. Sarah Cohen"],
    publicationDate: new Date(2024, 11, 5).toISOString(), // December 5, 2024
    date: new Date(2024, 11, 5).toISOString(),
    specialty: "Neurologie",
    category: "Infectiologie",
    source: "RHCA",
    volume: "04",
    issue: "48",
    pageNumber: 18,
    views: 327,
    downloads: 154,
    shares: 42,
    citations: 8,
    tags: ["Neurologie", "COVID-19", "Complications", "Infectiologie"],
    imageUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_04_no_48_05_12_2024.jpg`,
    pdfUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/RHCA_vol_04_no_48_05_12_2024.pdf`,
    status: "published",
    institution: "Hôpital Pitié-Salpêtrière",
    articleType: "RHCA",
    pdfFileName: "RHCA_vol_04_no_48_05_12_2024.pdf"
  },
  {
    id: "3",
    title: "Innovations en chirurgie cardiaque mini-invasive",
    abstract: "Panorama des avancées récentes en chirurgie cardiaque mini-invasive et leurs résultats cliniques.",
    authors: ["Dr. Vincent Mercier", "Dr. Émilie Dubois"],
    publicationDate: new Date(2024, 10, 18).toISOString(), // November 18, 2024
    date: new Date(2024, 10, 18).toISOString(),
    specialty: "Cardiologie",
    category: "Chirurgie",
    source: "RHCA",
    volume: "04",
    issue: "47",
    pageNumber: 32,
    views: 183,
    downloads: 89,
    shares: 21,
    citations: 5,
    tags: ["Cardiologie", "Chirurgie", "Mini-invasive", "Innovation"],
    imageUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_04_no_47_18_11_2024.jpg`,
    pdfUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/RHCA_vol_04_no_47_18_11_2024.pdf`,
    status: "published",
    institution: "Institut de Cardiologie de Montréal",
    articleType: "RHCA",
    pdfFileName: "RHCA_vol_04_no_47_18_11_2024.pdf"
  }
];
