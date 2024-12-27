export interface Highlight {
  title: string;
  description: string;
  category: string;
  date?: string;
  author?: string;
  image?: string;
  views?: number;
  citations?: number;
}

export const highlights: Highlight[] = [
  {
    title: "Nouvelle approche en chirurgie mini-invasive",
    description: "Une étude révolutionnaire sur les techniques chirurgicales modernes",
    category: "Chirurgie",
    date: "15 Feb 2024",
    author: "Dr. Martin",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format",
    views: 1250,
    citations: 45
  },
  {
    title: "Avancées en anesthésie régionale",
    description: "Les dernières innovations en matière d'anesthésie locorégionale",
    category: "Anesthésie",
    date: "12 Feb 2024",
    author: "Dr. Dubois",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format",
    views: 980,
    citations: 32
  },
  {
    title: "Impact des nouvelles technologies en médecine",
    description: "Comment l'IA transforme la pratique médicale quotidienne",
    category: "Innovation",
    date: "10 Feb 2024",
    author: "Dr. Bernard",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format",
    views: 1500,
    citations: 58
  }
];