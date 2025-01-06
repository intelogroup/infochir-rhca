import type { RhcaArticle } from "../types";

export const mockArticles: RhcaArticle[] = [
  // 2024 Articles
  {
    id: "2024-1",
    title: "Innovations en Chirurgie Robotique 2024",
    abstract: "Les dernières avancées en chirurgie robotique...",
    authors: ["Dr. Jean-Marc Bernard", "Dr. Marie Claire"],
    date: "2024-03-15",
    category: "Chirurgie",
    source: "RHCA",
    tags: ["robotique", "innovation", "chirurgie"],
    views: 320,
    citations: 15,
    downloads: 85,
    shares: 45,
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format"
  },
  {
    id: "2024-2",
    title: "Anesthésie en Pédiatrie: Nouvelles Approches",
    abstract: "Étude comparative des protocoles d'anesthésie...",
    authors: ["Dr. Sophie Martin", "Dr. Pierre Louis"],
    date: "2024-02-20",
    category: "Anesthésiologie",
    source: "RHCA",
    tags: ["pédiatrie", "anesthésie", "protocoles"],
    views: 280,
    citations: 12,
    downloads: 65,
    shares: 38
  },
  // 2023 Articles
  {
    id: "2023-1",
    title: "Chirurgie Cardiaque: Rétrospective 2023",
    abstract: "Bilan des interventions cardiaques majeures...",
    authors: ["Dr. Paul Robert", "Dr. Anne Marie"],
    date: "2023-12-15",
    category: "Cardiologie",
    source: "RHCA",
    tags: ["cardiologie", "chirurgie", "bilan"],
    views: 450,
    citations: 25,
    downloads: 120,
    shares: 75,
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format"
  },
  {
    id: "2023-2",
    title: "Traumatologie d'Urgence",
    abstract: "Protocoles actualisés en traumatologie...",
    authors: ["Dr. Michel Blanc"],
    date: "2023-11-10",
    category: "Traumatologie",
    source: "RHCA",
    tags: ["urgence", "traumatologie", "protocoles"],
    views: 380,
    citations: 18,
    downloads: 95,
    shares: 52
  },
  // 2022 Articles
  {
    id: "2022-1",
    title: "Évolution de la Chirurgie Mini-invasive",
    abstract: "Analyse des techniques mini-invasives...",
    authors: ["Dr. Claire Dubois", "Dr. Jean Pierre"],
    date: "2022-12-20",
    category: "Chirurgie",
    source: "RHCA",
    tags: ["mini-invasif", "innovation", "techniques"],
    views: 520,
    citations: 35,
    downloads: 150,
    shares: 88,
    imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format"
  },
  {
    id: "2022-2",
    title: "Anesthésie en Gériatrie",
    abstract: "Spécificités de l'anesthésie chez les patients âgés...",
    authors: ["Dr. Marie-José Baptiste"],
    date: "2022-11-15",
    category: "Anesthésiologie",
    source: "RHCA",
    tags: ["gériatrie", "anesthésie", "protocoles"],
    views: 420,
    citations: 28,
    downloads: 110,
    shares: 65
  }
];

// Sort articles by date (newest first)
mockArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());