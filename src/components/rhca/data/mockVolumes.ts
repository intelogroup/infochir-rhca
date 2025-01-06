import { cardiologyVolumes } from "./specialties/cardiology";
import { neurosurgeryVolumes } from "./specialties/neurosurgery";
import { pediatricVolumes } from "./specialties/pediatric";
import type { RhcaVolume } from "../types";

// Import existing volumes from the original file
const existingVolumes: RhcaVolume[] = [
  {
    id: "1",
    volume: 1,
    date: "2024-01-15",
    description: "Premier volume de 2024",
    articleCount: 12,
    downloadCount: 450,
    shareCount: 89,
    articles: [
      {
        id: "1",
        title: "Nouvelles approches en chirurgie mini-invasive hépatique",
        abstract: "Une étude comparative des techniques laparoscopiques avancées en chirurgie hépatique...",
        authors: ["Dr. Martin Claude", "Dr. Sophie Dubois", "Dr. Jean-Paul Berger"],
        date: "2024-01-15",
        views: 120,
        citations: 15,
        downloads: 45,
        shares: 23,
        pageNumber: 1,
        volume: 1,
        pdfUrl: "/path/to/pdf1.pdf",
        tags: ["Chirurgie hépatique", "Laparoscopie", "Innovation"]
      },
      {
        id: "2",
        title: "Impact de l'Intelligence Artificielle sur la planification chirurgicale",
        abstract: "Analyse des applications de l'intelligence artificielle dans la planification préopératoire...",
        authors: ["Dr. Bernard Lambert", "Dr. Marie-Claire Lambert"],
        date: "2024-01-10",
        views: 95,
        citations: 8,
        downloads: 32,
        shares: 18,
        pageNumber: 15,
        volume: 1,
        pdfUrl: "/path/to/pdf2.pdf",
        tags: ["IA", "Planification chirurgicale", "Innovation"]
      },
      {
        id: "3",
        title: "Gestion de la douleur post-opératoire : nouvelles approches pharmacologiques",
        abstract: "Évaluation des protocoles innovants de gestion de la douleur après chirurgie majeure...",
        authors: ["Dr. Pierre Moreau", "Dr. Anne Lefebvre"],
        date: "2024-01-08",
        views: 150,
        citations: 12,
        downloads: 55,
        shares: 28,
        pageNumber: 30,
        volume: 1,
        pdfUrl: "/path/to/pdf3.pdf",
        tags: ["Analgésie", "Post-opératoire", "Pharmacologie"]
      }
    ]
  },
  {
    id: "2",
    volume: 2,
    date: "2023-12-20",
    description: "Innovations en anesthésie",
    articleCount: 15,
    downloadCount: 380,
    shareCount: 72,
    articles: [
      {
        id: "4",
        title: "Anesthésie locorégionale échoguidée : techniques avancées",
        abstract: "Les dernières innovations en matière d'anesthésie locorégionale avec guidage échographique...",
        authors: ["Dr. Claire Dubois", "Dr. Marc Laurent"],
        date: "2023-12-20",
        views: 85,
        citations: 12,
        downloads: 38,
        shares: 20,
        pageNumber: 1,
        volume: 2,
        pdfUrl: "/path/to/pdf4.pdf",
        tags: ["Anesthésie", "Échographie", "Innovation"]
      },
      {
        id: "5",
        title: "Monitoring hémodynamique peropératoire : nouvelles technologies",
        abstract: "Évaluation des systèmes de monitoring avancés pour la surveillance peropératoire...",
        authors: ["Dr. Thomas Bernard", "Dr. Julie Martin"],
        date: "2023-12-15",
        views: 110,
        citations: 9,
        downloads: 42,
        shares: 25,
        pageNumber: 18,
        volume: 2,
        pdfUrl: "/path/to/pdf5.pdf",
        tags: ["Monitoring", "Hémodynamique", "Peropératoire"]
      },
      {
        id: "6",
        title: "Anesthésie en chirurgie ambulatoire : optimisation des protocoles",
        abstract: "Analyse comparative des protocoles d'anesthésie adaptés à la chirurgie ambulatoire...",
        authors: ["Dr. François Dupont", "Dr. Marie Rousseau"],
        date: "2023-12-10",
        views: 95,
        citations: 7,
        downloads: 35,
        shares: 19,
        pageNumber: 35,
        volume: 2,
        pdfUrl: "/path/to/pdf6.pdf",
        tags: ["Ambulatoire", "Protocoles", "Optimisation"]
      }
    ]
  },
  {
    id: "3",
    volume: 3,
    date: "2023-11-25",
    description: "Spécial chirurgie orthopédique",
    articleCount: 18,
    downloadCount: 520,
    shareCount: 95,
    articles: [
      {
        id: "7",
        title: "Prothèses de genou robotisées : résultats à 5 ans",
        abstract: "Étude rétrospective multicentrique sur les résultats à long terme des prothèses robotisées...",
        authors: ["Dr. Philippe Blanc", "Dr. Sarah Cohen"],
        date: "2023-11-25",
        views: 180,
        citations: 25,
        downloads: 65,
        shares: 35,
        pageNumber: 1,
        volume: 3,
        pdfUrl: "/path/to/pdf7.pdf",
        tags: ["Orthopédie", "Robotique", "Prothèse"]
      },
      {
        id: "8",
        title: "Chirurgie du rachis mini-invasive : nouvelles approches",
        abstract: "Innovations techniques en chirurgie rachidienne mini-invasive...",
        authors: ["Dr. Michel Durand", "Dr. Isabelle Petit"],
        date: "2023-11-20",
        views: 165,
        citations: 18,
        downloads: 58,
        shares: 30,
        pageNumber: 25,
        volume: 3,
        pdfUrl: "/path/to/pdf8.pdf",
        tags: ["Rachis", "Mini-invasif", "Innovation"]
      },
      {
        id: "9",
        title: "Reconstruction ligamentaire : techniques arthroscopiques avancées",
        abstract: "Évaluation des nouvelles techniques de reconstruction ligamentaire sous arthroscopie...",
        authors: ["Dr. Antoine Martin", "Dr. Louise Dubois"],
        date: "2023-11-15",
        views: 145,
        citations: 15,
        downloads: 52,
        shares: 28,
        pageNumber: 45,
        volume: 3,
        pdfUrl: "/path/to/pdf9.pdf",
        tags: ["Arthroscopie", "Ligaments", "Reconstruction"]
      }
    ]
  },
  {
    id: "4",
    volume: 4,
    date: "2023-10-15",
    description: "Focus sur la chirurgie digestive",
    articleCount: 14,
    downloadCount: 445,
    shareCount: 82,
    articles: [
      {
        id: "10",
        title: "Chirurgie bariatrique robotique : expérience sur 1000 cas",
        abstract: "Analyse rétrospective d'une série de 1000 interventions de chirurgie bariatrique robotique...",
        authors: ["Dr. Jean-Marc Robert", "Dr. Marie-Anne Dupont"],
        date: "2023-10-15",
        views: 210,
        citations: 30,
        downloads: 75,
        shares: 42,
        pageNumber: 1,
        volume: 4,
        pdfUrl: "/path/to/pdf10.pdf",
        tags: ["Bariatrique", "Robotique", "Étude de cas"]
      },
      {
        id: "11",
        title: "Cancer colorectal : approche laparoscopique versus robotique",
        abstract: "Étude comparative des résultats oncologiques entre approches laparoscopique et robotique...",
        authors: ["Dr. Paul Mercier", "Dr. Sophie Lambert"],
        date: "2023-10-10",
        views: 185,
        citations: 22,
        downloads: 68,
        shares: 35,
        pageNumber: 20,
        volume: 4,
        pdfUrl: "/path/to/pdf11.pdf",
        tags: ["Cancer colorectal", "Laparoscopie", "Robotique"]
      },
      {
        id: "12",
        title: "Innovations en chirurgie hépatobiliaire mini-invasive",
        abstract: "Revue des avancées techniques en chirurgie hépatobiliaire mini-invasive...",
        authors: ["Dr. Laurent Martin", "Dr. Caroline Duval"],
        date: "2023-10-05",
        views: 165,
        citations: 19,
        downloads: 60,
        shares: 32,
        pageNumber: 40,
        volume: 4,
        pdfUrl: "/path/to/pdf12.pdf",
        tags: ["Hépatobiliaire", "Mini-invasif", "Innovation"]
      }
    ]
  }
];

export const mockVolumes: RhcaVolume[] = [
  ...existingVolumes,
  ...cardiologyVolumes,
  ...neurosurgeryVolumes,
  ...pediatricVolumes
];
