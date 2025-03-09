
export interface Highlight {
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  author?: string;
  link?: string;
}

export const highlights: Highlight[] = [
  {
    title: "Séminaire sur les nouvelles techniques de chirurgie digestive",
    description: "Un séminaire regroupant les chirurgiens du pays a été organisé au HUEH pour présenter les nouvelles techniques de chirurgie digestive.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    date: "15/01/2024",
    category: "RHCA",
    author: "Dr. Jean Dupont",
    link: "#"
  },
  {
    title: "Lymphœdème chronique : physiopathologie et prise en charge",
    description: "Cette revue aborde la physiopathologie du lymphœdème chronique ainsi que les modalités thérapeutiques actuelles pour cette affection.",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&auto=format&fit=crop&q=80",
    date: "10/02/2024",
    category: "IGM",
    author: "Dr. Marie Laurent, Dr. Pierre Michel",
    link: "#"
  },
  {
    title: "Cas clinique: Présentation atypique d'une appendicite aiguë",
    description: "Ce cas clinique présente une forme atypique d'appendicite aiguë chez un patient de 45 ans, illustrant les défis diagnostiques rencontrés en urgence.",
    image: "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?w=800&auto=format&fit=crop&q=80",
    date: "05/03/2024",
    category: "ADC",
    author: "Dr. Louis Télémaque",
    link: "#"
  },
  {
    title: "Conférence internationale sur la chirurgie traumatologique",
    description: "La conférence internationale sur la chirurgie traumatologique se tiendra au Karibe Convention Center du 20 au 22 juin 2024.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
    date: "20/03/2024",
    category: "Événement",
    link: "#"
  },
  {
    title: "Formation en échographie FAST pour les urgentistes",
    description: "Une formation en échographie FAST sera organisée pour les médecins urgentistes et traumatologues le mois prochain.",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80",
    date: "02/04/2024",
    category: "Formation",
    link: "#"
  }
];
