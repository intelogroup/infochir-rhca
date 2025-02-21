
import type { RhcaVolume } from "../../types";

export const volumes2022: RhcaVolume[] = [
  {
    id: "2022-12",
    volume: 12,
    date: "2022-12-15",
    description: "Rétrospective 2022",
    articleCount: 16,
    downloadCount: 580,
    shareCount: 120,
    articles: [
      {
        id: "22-12-1",
        title: "Bilan des avancées chirurgicales 2022",
        abstract: "Synthèse des innovations majeures en chirurgie au cours de l'année 2022, avec un accent particulier sur l'intelligence artificielle et la robotique...",
        authors: ["Dr. Jean Alouidor", "Dr. Marie-Claire Dubois"],
        date: "2022-12-15",
        views: 320,
        citations: 45,
        downloads: 115,
        shares: 62,
        pageNumber: "1",
        volume: "12",
        tags: ["Rétrospective", "Innovation", "IA"],
        publicationDate: "2022-12-15",
        specialty: "Chirurgie générale",
        imageUrl: "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=format",
        source: "RHCA",
        pdfUrl: "RHCA_2022_12_bilan_annuel.pdf"
      }
    ],
    coverImage: "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=format"
  },
  {
    id: "2022-09",
    volume: 9,
    date: "2022-09-15",
    description: "Chirurgie digestive",
    articleCount: 14,
    downloadCount: 520,
    shareCount: 105,
    articles: [
      {
        id: "22-09-1",
        title: "Innovations en chirurgie colorectale",
        abstract: "Présentation des nouvelles techniques en chirurgie colorectale mini-invasive, incluant l'approche robotique et laparoscopique...",
        authors: ["Dr. Pierre Martin", "Dr. Sophie Bernard"],
        date: "2022-09-15",
        views: 290,
        citations: 38,
        downloads: 98,
        shares: 52,
        pageNumber: "1",
        volume: "9",
        tags: ["Digestif", "Colorectal", "Robotique"],
        publicationDate: "2022-09-15",
        specialty: "Chirurgie digestive",
        imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800&auto=format",
        source: "RHCA"
      }
    ],
    coverImage: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800&auto=format"
  },
  {
    id: "2022-06",
    volume: 6,
    date: "2022-06-15",
    description: "Chirurgie cardiaque",
    articleCount: 13,
    downloadCount: 460,
    shareCount: 98,
    articles: [
      {
        id: "22-06-1",
        title: "Nouvelles approches en chirurgie valvulaire",
        abstract: "Analyse des résultats des techniques transcathéter dans le remplacement valvulaire aortique...",
        authors: ["Dr. Marc Dubois", "Dr. Claire Martin"],
        date: "2022-06-15",
        views: 275,
        citations: 32,
        downloads: 88,
        shares: 45,
        pageNumber: "1",
        volume: "6",
        tags: ["Cardiaque", "Valvulaire", "TAVI"],
        publicationDate: "2022-06-15",
        specialty: "Chirurgie cardiaque",
        imageUrl: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&auto=format",
        source: "RHCA"
      }
    ],
    coverImage: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&auto=format"
  },
  {
    id: "2022-03",
    volume: 3,
    date: "2022-03-15",
    description: "Traumatologie",
    articleCount: 12,
    downloadCount: 440,
    shareCount: 92,
    articles: [
      {
        id: "22-03-1",
        title: "Prise en charge des polytraumatisés",
        abstract: "Mise à jour des protocoles de prise en charge des patients polytraumatisés, intégrant les dernières recommandations internationales...",
        authors: ["Dr. Jean-Paul Bernard", "Dr. Marie Lambert"],
        date: "2022-03-15",
        views: 265,
        citations: 30,
        downloads: 85,
        shares: 48,
        pageNumber: "1",
        volume: "3",
        tags: ["Traumatologie", "Urgences", "Protocoles"],
        publicationDate: "2022-03-15",
        specialty: "Traumatologie",
        imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a7?w=800&auto=format",
        source: "RHCA",
        pdfUrl: "RHCA_2022_03_polytraumatises.pdf"
      }
    ],
    coverImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a7?w=800&auto=format"
  }
];
