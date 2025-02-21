
import type { RhcaVolume } from "../../types";

export const volumes2021: RhcaVolume[] = [
  {
    id: "2021-12",
    volume: 12,
    date: "2021-12-15",
    description: "Rétrospective 2021",
    articleCount: 15,
    downloadCount: 550,
    shareCount: 110,
    articles: [
      {
        id: "21-12-1",
        title: "Bilan annuel de la chirurgie 2021",
        abstract: "Revue des avancées majeures en chirurgie au cours de l'année 2021, incluant les nouvelles techniques mini-invasives et les progrès en robotique chirurgicale.",
        authors: ["Dr. Marc Antoine", "Dr. Julie Pierre"],
        date: "2021-12-15",
        views: 310,
        citations: 42,
        downloads: 105,
        shares: 58,
        pageNumber: "1-15",
        volume: "12",
        tags: ["Rétrospective", "Bilan", "Innovation"],
        publicationDate: "2021-12-15",
        specialty: "Chirurgie générale",
        source: "RHCA",
        pdfUrl: "2021/vol12/bilan-annuel-chirurgie-2021.pdf"
      },
      {
        id: "21-12-2",
        title: "Innovations en chirurgie robotique 2021",
        abstract: "État des lieux des avancées en chirurgie robotique, avec focus sur les applications en chirurgie digestive et thoracique.",
        authors: ["Dr. Sophie Martin", "Dr. Paul Dubois"],
        date: "2021-12-15",
        views: 285,
        citations: 38,
        downloads: 95,
        shares: 45,
        pageNumber: "16-30",
        volume: "12",
        tags: ["Robotique", "Innovation", "Technologie"],
        publicationDate: "2021-12-15",
        specialty: "Chirurgie robotique",
        source: "RHCA",
        pdfUrl: "2021/vol12/innovations-chirurgie-robotique-2021.pdf"
      }
    ],
    coverImage: "/placeholder.svg"
  },
  {
    id: "2021-01",
    volume: 1,
    date: "2021-01-15",
    description: "Chirurgie d'urgence",
    articleCount: 12,
    downloadCount: 420,
    shareCount: 85,
    articles: [
      {
        id: "21-01-1",
        title: "Protocoles en chirurgie d'urgence",
        abstract: "Mise à jour des protocoles de prise en charge en chirurgie d'urgence, intégrant les dernières recommandations internationales.",
        authors: ["Dr. Pierre Louis", "Dr. Marie Joseph"],
        date: "2021-01-15",
        views: 260,
        citations: 28,
        downloads: 78,
        shares: 42,
        pageNumber: "1-12",
        volume: "1",
        tags: ["Urgence", "Protocoles", "Guidelines"],
        publicationDate: "2021-01-15",
        specialty: "Chirurgie d'urgence",
        source: "RHCA",
        pdfUrl: "2021/vol1/protocoles-chirurgie-urgence.pdf"
      },
      {
        id: "21-01-2",
        title: "Traumatologie en urgence : approche actualisée",
        abstract: "Nouvelles approches dans la prise en charge des traumatismes en urgence, incluant les protocoles de damage control.",
        authors: ["Dr. Jean Dupont", "Dr. Claire Martin"],
        date: "2021-01-15",
        views: 245,
        citations: 25,
        downloads: 70,
        shares: 38,
        pageNumber: "13-25",
        volume: "1",
        tags: ["Traumatologie", "Urgence", "Damage Control"],
        publicationDate: "2021-01-15",
        specialty: "Traumatologie",
        source: "RHCA",
        pdfUrl: "2021/vol1/traumatologie-urgence-2021.pdf"
      }
    ],
    coverImage: "/placeholder.svg"
  }
];
