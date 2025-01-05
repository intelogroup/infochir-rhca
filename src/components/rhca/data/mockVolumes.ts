import type { RhcaVolume } from "../types";

export const mockVolumes: RhcaVolume[] = [
  {
    id: "1",
    volume: "INFOCHIR/RHCA Volume 7 Numéro 47",
    date: new Date(2024, 0, 1).toISOString(),
    description: "Volume 47 de la revue INFOCHIR-RHCA",
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=700&fit=crop",
    articleCount: 8,
    downloadCount: 325,
    shareCount: 156,
    articles: [
      {
        id: "1",
        title: "ÉDITORIAL",
        authors: ["Comité éditorial"],
        abstract: "Éditorial du numéro 47 de la revue INFOCHIR-RHCA",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 4,
        tags: ["éditorial"],
        views: 120,
        citations: 5,
        downloads: 45,
        volume: "47"
      },
      {
        id: "2",
        title: "Lymphadénite tuberculeuse cervicale associée à une anémie chronique, à propos d'un cas",
        authors: ["Eunice DERIVOIS MERISIER", "et al"],
        abstract: "Étude de cas sur la lymphadénite tuberculeuse cervicale et ses complications",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 5,
        tags: ["tuberculose", "anémie", "cas clinique"],
        views: 85,
        citations: 3,
        downloads: 30,
        volume: "47"
      },
      {
        id: "3",
        title: "Corps étranger bronchique chez l'enfant, à propos d'un cas",
        authors: ["Patrick Marc JEAN-GILLES"],
        abstract: "Présentation d'un cas de corps étranger bronchique chez l'enfant et sa prise en charge",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 14,
        tags: ["pédiatrie", "pneumologie", "cas clinique"],
        views: 95,
        citations: 2,
        downloads: 40,
        volume: "47"
      },
      {
        id: "4",
        title: "Glycation et les maladies",
        authors: ["Reynald ALTEMA"],
        abstract: "Étude approfondie sur le processus de glycation et son impact sur diverses pathologies",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 16,
        tags: ["biochimie", "pathologie"],
        views: 150,
        citations: 8,
        downloads: 65,
        volume: "47"
      },
      {
        id: "5",
        title: "Instabilité sociopolitique et prise en charge de la drépanocytose chez les enfants en Haïti",
        authors: ["Ronald ÉVEILLARD", "et al"],
        abstract: "Analyse de l'impact de l'instabilité sociopolitique sur la prise en charge des enfants drépanocytaires en Haïti",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 20,
        tags: ["pédiatrie", "santé publique", "drépanocytose"],
        views: 200,
        citations: 12,
        downloads: 88,
        volume: "47"
      },
      {
        id: "6",
        title: "Les défis de la chirurgie pédiatrique en Haïti",
        authors: ["Marie-Carmelle PAUL", "Jean-Robert PIERRE"],
        abstract: "Analyse des défis et opportunités dans la pratique de la chirurgie pédiatrique en Haïti",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 25,
        tags: ["chirurgie pédiatrique", "santé publique"],
        views: 175,
        citations: 10,
        downloads: 70,
        volume: "47"
      },
      {
        id: "7",
        title: "Actualités en anesthésiologie",
        authors: ["Pierre LOUIS"],
        abstract: "Revue des dernières avancées en anesthésiologie et leur application dans le contexte haïtien",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 30,
        tags: ["anesthésiologie", "pratique clinique"],
        views: 160,
        citations: 7,
        downloads: 55,
        volume: "47"
      },
      {
        id: "8",
        title: "Recommandations pour la prise en charge des urgences chirurgicales",
        authors: ["Comité scientifique INFOCHIR-RHCA"],
        abstract: "Guide pratique pour la gestion des urgences chirurgicales dans les hôpitaux haïtiens",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 35,
        tags: ["urgences", "chirurgie", "protocoles"],
        views: 250,
        citations: 15,
        downloads: 95,
        volume: "47"
      }
    ]
  },
  {
    id: "2",
    volume: "INFOCHIR/RHCA Volume 7 Numéro 46",
    date: new Date(2023, 9, 1).toISOString(),
    description: "Volume 46 de la revue INFOCHIR-RHCA",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=700&fit=crop",
    articleCount: 6,
    downloadCount: 280,
    shareCount: 120,
    articles: [
      {
        id: "1",
        title: "Prise en charge des traumatismes crâniens en Haïti",
        authors: ["Marie DURAND", "Jean PIERRE"],
        abstract: "Étude sur les protocoles de prise en charge des traumatismes crâniens dans les hôpitaux haïtiens",
        date: new Date(2024, 3, 1).toISOString(),
        pageNumber: 4,
        tags: ["neurochirurgie", "traumatologie"],
        views: 180,
        citations: 15,
        downloads: 75,
        volume: "46"
      },
      {
        id: "2",
        title: "Innovations en chirurgie laparoscopique",
        authors: ["Paul MARTIN"],
        abstract: "Revue des dernières avancées en chirurgie mini-invasive",
        date: new Date(2024, 3, 1).toISOString(),
        pageNumber: 12,
        tags: ["chirurgie", "laparoscopie"],
        views: 220,
        citations: 18,
        downloads: 95,
        volume: "46"
      }
    ]
  },
  {
    id: "3",
    volume: "INFOCHIR/RHCA Volume 7 Numéro 45",
    date: new Date(2023, 6, 1).toISOString(),
    description: "Volume 45 de la revue INFOCHIR-RHCA",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=700&fit=crop",
    articleCount: 7,
    downloadCount: 245,
    shareCount: 98,
    articles: []
  },
  {
    id: "4",
    volume: "INFOCHIR/RHCA Volume 7 Numéro 44",
    date: new Date(2023, 3, 1).toISOString(),
    description: "Volume 44 de la revue INFOCHIR-RHCA",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=700&fit=crop",
    articleCount: 9,
    downloadCount: 312,
    shareCount: 134,
    articles: []
  },
  {
    id: "5",
    volume: "INFOCHIR/RHCA Volume 6 Numéro 43",
    date: new Date(2022, 11, 1).toISOString(),
    description: "Volume 43 de la revue INFOCHIR-RHCA",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=700&fit=crop",
    articleCount: 8,
    downloadCount: 289,
    shareCount: 112,
    articles: []
  }
];
