
import { RhcaArticle } from "../types";
import { formatDateForFilename } from "@/lib/utils";

// Create a date for our consistent filename pattern (DD_MM_YYYY)
const currentDate = new Date();
const formattedDate = formatDateForFilename(currentDate);

export const mockRhcaArticles: RhcaArticle[] = [
  {
    id: "1",
    title: "Avancées dans le traitement des fractures complexes du bassin",
    abstract: "Une analyse des nouvelles approches thérapeutiques pour les fractures complexes du bassin suite à des traumatismes à haute énergie.",
    authors: ["Dr. Marie Laurent", "Dr. Thomas Dubois", "Dr. Philippe Moreau"],
    publicationDate: new Date(2023, 10, 15).toISOString(), // November 15, 2023
    date: new Date(2023, 10, 15).toISOString(),
    specialty: "Orthopédie",
    category: "Traumatologie",
    source: "RHCA",
    volume: "03",
    issue: "42",
    pageNumber: 24,
    views: 312,
    downloads: 156,
    shares: 42,
    citations: 7,
    tags: ["Orthopédie", "Traumatologie", "Bassin", "Fracture"],
    imageUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_03_no_42_15_11_2023.jpg`,
    pdfUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/RHCA_vol_03_no_42_15_11_2023.pdf`,
    status: "published",
    institution: "CHU de Bordeaux",
    articleType: "RHCA",
    pdfFileName: "RHCA_vol_03_no_42_15_11_2023.pdf"
  },
  {
    id: "2",
    title: "Évaluation comparative des techniques de reconstruction du ligament croisé antérieur",
    abstract: "Étude rétrospective comparant les résultats fonctionnels des différentes techniques de reconstruction du LCA sur une période de 5 ans.",
    authors: ["Dr. Jean Dupont", "Dr. Caroline Lefèvre"],
    publicationDate: new Date(2023, 7, 23).toISOString(), // August 23, 2023
    date: new Date(2023, 7, 23).toISOString(),
    specialty: "Orthopédie",
    category: "Médecine du sport",
    source: "RHCA",
    volume: "03",
    issue: "39",
    pageNumber: 18,
    views: 427,
    downloads: 214,
    shares: 53,
    citations: 12,
    tags: ["Orthopédie", "LCA", "Médecine du sport", "Reconstruction"],
    imageUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_03_no_39_23_08_2023.jpg`,
    pdfUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/RHCA_vol_03_no_39_23_08_2023.pdf`,
    status: "published",
    institution: "Hôpital Pitié-Salpêtrière",
    articleType: "RHCA",
    pdfFileName: "RHCA_vol_03_no_39_23_08_2023.pdf"
  },
  {
    id: "3",
    title: "Impact de l'antibiothérapie préopératoire sur l'incidence des infections du site opératoire en chirurgie orthopédique",
    abstract: "Analyse de l'efficacité de différents protocoles d'antibiothérapie préopératoire dans la prévention des infections du site opératoire en chirurgie orthopédique programmée.",
    authors: ["Dr. Amina Benali", "Dr. Robert Martin", "Dr. Claire Bonnet"],
    publicationDate: new Date(2023, 4, 10).toISOString(), // May 10, 2023
    date: new Date(2023, 4, 10).toISOString(),
    specialty: "Orthopédie",
    category: "Infectiologie",
    source: "RHCA",
    volume: "03",
    issue: "36",
    pageNumber: 32,
    views: 283,
    downloads: 129,
    shares: 38,
    citations: 9,
    tags: ["Orthopédie", "Antibiothérapie", "Infection", "Prévention"],
    imageUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca_covers/RHCA_vol_03_no_36_10_05_2023.jpg`,
    pdfUrl: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/RHCA_vol_03_no_36_10_05_2023.pdf`,
    status: "published",
    institution: "CHU de Montpellier",
    articleType: "RHCA",
    pdfFileName: "RHCA_vol_03_no_36_10_05_2023.pdf"
  }
];
