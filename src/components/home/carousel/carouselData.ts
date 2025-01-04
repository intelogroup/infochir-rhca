export interface ExtendedContent {
  keyPoints: string[];
  conclusion?: string;
}

export interface Highlight {
  title: string;
  description: string;
  category: string;
  date?: string;
  author?: string;
  image?: string;
  views?: number;
  citations?: number;
  extendedContent?: ExtendedContent;
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
    citations: 45,
    extendedContent: {
      keyPoints: [
        "Réduction significative du temps de récupération post-opératoire",
        "Diminution des complications post-chirurgicales de 35%",
        "Nouvelle technique applicable dans 80% des cas standards",
        "Validation sur une cohorte de 500 patients"
      ],
      conclusion: "Cette approche révolutionnaire ouvre la voie à une nouvelle ère de la chirurgie mini-invasive, promettant des résultats optimaux avec une récupération accélérée."
    }
  },
  {
    title: "Avancées en anesthésie régionale",
    description: "Les dernières innovations en matière d'anesthésie locorégionale",
    category: "Anesthésie",
    date: "12 Feb 2024",
    author: "Dr. Dubois",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format",
    views: 980,
    citations: 32,
    extendedContent: {
      keyPoints: [
        "Nouvelle technique d'imagerie pour le guidage des injections",
        "Amélioration de la précision de 45%",
        "Réduction du temps de procédure de 30%",
        "Satisfaction patient augmentée de 25%"
      ],
      conclusion: "L'intégration de ces nouvelles technologies permet une précision accrue et une meilleure expérience patient."
    }
  },
  {
    title: "Impact des nouvelles technologies en médecine",
    description: "Comment l'IA transforme la pratique médicale quotidienne",
    category: "Innovation",
    date: "10 Feb 2024",
    author: "Dr. Bernard",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format",
    views: 1500,
    citations: 58,
    extendedContent: {
      keyPoints: [
        "Amélioration du diagnostic précoce de 40%",
        "Réduction des erreurs médicales de 25%",
        "Optimisation du temps de consultation",
        "Personnalisation accrue des traitements"
      ],
      conclusion: "L'IA s'impose comme un outil indispensable pour améliorer la qualité des soins et l'efficacité des praticiens."
    }
  },
  {
    title: "Congrès International de Chirurgie 2024",
    description: "Rejoignez-nous pour le plus grand événement chirurgical de l'année",
    category: "Événement",
    date: "20 Mar 2024",
    author: "Comité Organisateur",
    image: "https://images.unsplash.com/photo-1576670392954-858d5d9b5563?w=800&auto=format",
    views: 850,
    citations: 0
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
