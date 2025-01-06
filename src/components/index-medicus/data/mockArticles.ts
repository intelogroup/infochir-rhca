import type { Article } from "../types";

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Étude sur l'hypertension artérielle en Haïti",
    abstract: "Une analyse approfondie de la prévalence de l'hypertension artérielle dans les zones rurales d'Haïti.",
    authors: ["Dr. Jean Pierre", "Dr. Marie Claude"],
    date: "2024-01-15",
    category: "Cardiologie",
    source: "RHCA",
    tags: ["hypertension", "santé publique", "Haïti"],
    views: 150,
    citations: 12,
    downloads: 45
  },
  {
    id: "2",
    title: "Impact du COVID-19 sur le système de santé haïtien",
    abstract: "Évaluation des conséquences de la pandémie sur l'infrastructure sanitaire en Haïti.",
    authors: ["Dr. Robert Louis", "Dr. Anne Marie Joseph"],
    date: "2023-12-20",
    category: "Santé Publique",
    source: "IGM",
    tags: ["COVID-19", "pandémie", "système de santé"],
    views: 280,
    citations: 8,
    downloads: 67
  },
  {
    id: "3",
    title: "Diabète de type 2 : prévalence et facteurs de risque",
    abstract: "Recherche sur l'incidence du diabète de type 2 dans la population haïtienne.",
    authors: ["Dr. Michel François"],
    date: "2023-11-10",
    category: "Endocrinologie",
    source: "ADC",
    tags: ["diabète", "facteurs de risque", "épidémiologie"],
    views: 195,
    citations: 15,
    downloads: 89
  }
];