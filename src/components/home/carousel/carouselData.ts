
export interface Highlight {
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  author?: string;
  link: string;
}

// Default highlights to display when no data is available from the API
export const highlights: Highlight[] = [
  {
    title: "Dernières innovations en chirurgie laparoscopique",
    description: "Découvrez les avancées récentes en chirurgie mini-invasive et leurs applications cliniques.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    date: "12/05/2023",
    category: "IGM",
    author: "Dr. Martin Dubois",
    link: "/articles/1",
  },
  {
    title: "Étude comparative des techniques d'anesthésie régionale",
    description: "Analyse des différentes approches d'anesthésie régionale et leurs impacts sur la récupération post-opératoire.",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80",
    date: "28/04/2023",
    category: "RHCA",
    author: "Dr. Sophie Legrand",
    link: "/articles/2",
  },
  {
    title: "Actualisation des recommandations en chirurgie cardiaque",
    description: "Mise à jour des pratiques recommandées en chirurgie cardiaque basée sur les dernières données probantes.",
    image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&auto=format&fit=crop&q=80",
    date: "15/03/2023",
    category: "ADC",
    author: "Dr. Alexandre Moreau",
    link: "/articles/3",
  }
];
