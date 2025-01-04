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
    title: "Congrès International de Chirurgie 2024",
    description: "Rejoignez-nous pour le plus grand événement chirurgical de l'année",
    category: "Événement",
    date: "20 Mar 2024",
    author: "Comité Organisateur",
    image: "https://images.unsplash.com/photo-1576670392954-858d5d9b5563?w=800&auto=format",
    location: "Centre de Conférences Médical, Paris",
    duration: "2 jours",
    maxParticipants: 150
  },
  {
    title: "Formation: Techniques avancées en laparoscopie",
    description: "Programme intensif de formation pour chirurgiens expérimentés",
    category: "Formation",
    date: "5 Apr 2024",
    author: "Dr. Moreau",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format",
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
  },
  {
    title: "Nouvelles directives en chirurgie orthopédique",
    description: "Mise à jour des protocoles et recommandations pour 2024",
    category: "Directives",
    date: "8 Feb 2024",
    author: "Dr. Lambert",
    image: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=800&auto=format",
    views: 1100,
    citations: 25
  },
  {
    title: "Formation: Techniques avancées en laparoscopie",
    description: "Programme intensif de formation pour chirurgiens expérimentés",
    category: "Formation",
    date: "5 Apr 2024",
    author: "Dr. Moreau",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format",
    views: 720,
    citations: 0
  }
];
