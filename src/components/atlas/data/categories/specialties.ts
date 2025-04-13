
import { AtlasChapter } from "../../types";

export const specialtiesChapters: AtlasChapter[] = [
  {
    id: "3",
    title: "SEIN",
    description: "Exploration détaillée des pathologies mammaires...",
    lastUpdate: "2023-03-30",
    publicationDate: "2023-03-30",
    status: "available",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1470&fit=crop",
    stats: {
      views: 500,
      shares: 20,
      downloads: 30
    },
    source: "ADC",
    authors: ["Dr. Martin", "Dr. Bernard"],
    tags: ["sein", "chirurgie mammaire"],
    abstract: "Guide complet sur la chirurgie mammaire"
  },
  {
    id: "4",
    title: "NEURO CHIRURGIE",
    description: "Guide complet des interventions neurochirurgicales modernes...",
    lastUpdate: "2021-10-11",
    publicationDate: "2021-10-11",
    status: "available",
    coverImage: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1470&fit=crop",
    stats: {
      views: 300,
      shares: 15,
      downloads: 25
    },
    source: "ADC",
    authors: ["Dr. Dubois", "Dr. Lambert"],
    tags: ["neurochirurgie", "cerveau"],
    abstract: "Approches modernes en neurochirurgie"
  },
  {
    id: "5",
    title: "OPHTALMO ORL CMF",
    description: "Approche intégrée des pathologies ophtalmologiques...",
    lastUpdate: "2021-10-11",
    publicationDate: "2021-10-11",
    status: "available",
    coverImage: "https://images.unsplash.com/photo-1584017911780-6e64c7b25c58?q=80&w=1470&fit=crop",
    stats: {
      views: 450,
      shares: 18,
      downloads: 22
    },
    source: "ADC",
    authors: ["Dr. Moreau", "Dr. Garcia"],
    tags: ["ophtalmo", "ORL", "CMF"],
    abstract: "Guide complet des pathologies ORL et ophtalmologiques"
  }
];
