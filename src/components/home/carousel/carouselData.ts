export type HighlightType = 'formation' | 'event' | 'article' | 'message' | 'news' | 'webinar' | 'publication';

export interface Highlight {
  title: string;
  description: string;
  image: string;
  type: HighlightType;
  category: string;
  date?: string;
  time?: string;
  author?: string;
}

export const highlights: Highlight[] = [
  {
    title: "Formation en Chirurgie Laparoscopique",
    description: "Atelier pratique de 3 jours sur les techniques avancées de chirurgie mini-invasive",
    image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?q=80&w=1974&auto=format&fit=crop",
    date: "15-17 Mars 2024",
    type: "formation",
    category: "Formation"
  },
  {
    title: "Congrès International de Chirurgie",
    description: "Rejoignez-nous pour le plus grand événement chirurgical de l'année avec des experts internationaux",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1974&auto=format&fit=crop",
    date: "5-7 Avril 2024",
    type: "event",
    category: "Événement"
  },
  {
    title: "Nouvelle Technique de Transplantation",
    description: "Une équipe de chercheurs développe une approche révolutionnaire pour la transplantation d'organes",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1780&auto=format&fit=crop",
    type: "article",
    category: "Article RHCA",
    author: "Dr. Marie Laurent"
  },
  {
    title: "Message du Président de l'ASHAC",
    description: "Perspectives sur l'avenir de la chirurgie en Haïti et les défis à relever ensemble",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
    type: "message",
    category: "Message",
    author: "Prof. Jean-Robert Pierre"
  },
  {
    title: "Avancées en Chirurgie Robotique",
    description: "Les dernières innovations en matière de chirurgie assistée par robot",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1974&auto=format&fit=crop",
    type: "news",
    category: "Actualité",
    date: "28 Février 2024"
  },
  {
    title: "Webinaire: Innovations en Anesthésie",
    description: "Discussion interactive sur les nouvelles approches en anesthésie régionale",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=1974&auto=format&fit=crop",
    type: "webinar",
    category: "Webinaire",
    date: "20 Mars 2024",
    time: "14:00 - 16:00 UTC"
  },
  {
    title: "Étude IGM: Traitement du Cancer Colorectal",
    description: "Résultats prometteurs d'une nouvelle approche thérapeutique combinée",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=1978&auto=format&fit=crop",
    type: "article",
    category: "Article IGM",
    author: "Dr. Sophie Dubois",
    date: "1 Mars 2024"
  },
  {
    title: "Atlas ADC: Guide de Chirurgie Pédiatrique",
    description: "Nouvelle publication détaillant les techniques spécialisées en chirurgie pédiatrique",
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2070&auto=format&fit=crop",
    type: "publication",
    category: "Atlas ADC",
    author: "Équipe de Chirurgie Pédiatrique"
  },
  {
    title: "Webinaire: Gestion de la Douleur Post-opératoire",
    description: "Experts internationaux partagent les meilleures pratiques en gestion de la douleur",
    image: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?q=80&w=2070&auto=format&fit=crop",
    type: "webinar",
    category: "Webinaire",
    date: "25 Mars 2024",
    time: "15:00 - 17:00 UTC"
  },
  {
    title: "RHCA: Techniques Minimalement Invasives",
    description: "Revue systématique des dernières avancées en chirurgie mini-invasive",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop",
    type: "article",
    category: "Article RHCA",
    author: "Prof. Marc Dupont"
  }
];
