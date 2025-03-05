
export interface Highlight {
  title: string;
  description: string;
  category: string;
  date?: string;
  author?: string;
  image?: string;
  views?: number;
  citations?: number;
  keyPoints?: string[];
  conclusion?: string;
  location?: string;
  duration?: string;
  maxParticipants?: number;
  prerequisites?: string[];
  objectives?: string[];
  id?: string;
  link?: string;
}

export const highlights: Highlight[] = [
  {
    title: "Nouvelle approche en chirurgie mini-invasive",
    description: "Une étude révolutionnaire sur les techniques chirurgicales modernes",
    category: "Chirurgie",
    date: "15 Feb 2024",
    author: "Dr. Martin",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    views: 1250,
    citations: 45
  },
  {
    title: "Congrès International de Chirurgie 2024",
    description: "Rejoignez-nous pour le plus grand événement chirurgical de l'année",
    category: "Événement",
    date: "20 Mar 2024",
    location: "Centre de Conférences Médical, Paris",
    duration: "2 jours",
    maxParticipants: 150,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=80"
  },
  {
    title: "Formation: Techniques avancées en laparoscopie",
    description: "Programme intensif de formation pour chirurgiens expérimentés",
    category: "Formation",
    date: "5 Apr 2024",
    author: "Dr. Moreau",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80",
    prerequisites: ["3 ans d'expérience en chirurgie", "Pratique régulière de la laparoscopie"],
    objectives: [
      "Maîtriser les techniques avancées",
      "Développer des compétences pratiques",
      "Comprendre les applications cliniques"
    ],
    maxParticipants: 10
  },
  {
    title: "Avancées en anesthésie régionale",
    description: "Les dernières innovations en matière d'anesthésie locorégionale",
    category: "Anesthésie",
    date: "12 Feb 2024",
    author: "Dr. Dubois",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop&q=80",
    views: 980,
    citations: 32
  },
  {
    title: "Impact des nouvelles technologies en médecine",
    description: "Comment l'IA transforme la pratique médicale quotidienne",
    category: "Innovation",
    date: "10 Feb 2024",
    author: "Dr. Bernard",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    views: 1500,
    citations: 58
  },
  {
    title: "Nouvelles directives en chirurgie orthopédique",
    description: "Mise à jour des protocoles et recommandations pour 2024",
    category: "Directives",
    date: "8 Feb 2024",
    author: "Dr. Lambert",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&auto=format&fit=crop&q=80",
    views: 1100,
    citations: 25
  }
];
