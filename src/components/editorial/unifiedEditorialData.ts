
export interface UnifiedEditorialMember {
  id: number;
  name: string;
  role: string;
  title?: string;
  specialty?: string;
  email?: string;
  image?: string;
  isCoordinator?: boolean;
}

export interface UnifiedEditorialSection {
  title: string;
  members: UnifiedEditorialMember[];
}

export const unifiedEditorInChief = {
  name: "Jean Alouidor",
  role: "Editeur en chef",
  id: 100
};

export const unifiedEditorialData: UnifiedEditorialSection[] = [
  {
    title: "Rédaction et de l'Éditorial",
    members: [
      { id: 1, name: "Michel Dodard", role: "directeur", isCoordinator: true },
      { id: 2, name: "Maxime Coles", role: "conseiller" }
    ]
  },
  {
    title: "Lu pour vous",
    members: [
      { id: 3, name: "Michel Dodard", role: "coordonnateur", isCoordinator: true },
      { id: 4, name: "Ernst Jean Baptiste", role: "membre" },
      { id: 5, name: "Henry Jean-Baptiste", role: "membre" }
    ]
  },
  {
    title: "Santé Publique",
    members: [
      { id: 6, name: "Pavel Desrosiers", role: "coordonnateur", isCoordinator: true },
      { id: 7, name: "Franck Généus", role: "membre" },
      { id: 8, name: "Guirlaine Raymond", role: "membre" },
      { id: 9, name: "Chesnel Norcéide", role: "membre" },
      { id: 10, name: "Mario Laroche", role: "membre" }
    ]
  },
  {
    title: "Actualités Intra Hospitalières",
    members: [
      { id: 11, name: "Christophe Millien", role: "coordonnateur", isCoordinator: true },
      { id: 12, name: "Wilfine Dupont", role: "membre" },
      { id: 13, name: "Pierre-Marie Woolley", role: "membre" },
      { id: 14, name: "Vanessa Jaelle Dor", role: "membre" }
    ]
  },
  {
    title: "Académie et Professions",
    members: [
      { id: 15, name: "Edith C. Georges", role: "coordonnatrice", isCoordinator: true },
      { id: 16, name: "Marlyn Lestage-Laforest", role: "membre" },
      { id: 17, name: "Carine Réveil Jean-Baptiste", role: "membre" }
    ]
  },
  {
    title: "Informations Socio Culturelles",
    members: [
      { id: 18, name: "Jessy Colimon Adrien", role: "coordonnatrice", isCoordinator: true },
      { id: 19, name: "Judith Jean-Baptiste", role: "adjointe" },
      { id: 20, name: "Wisly Joseph", role: "membre" },
      { id: 21, name: "Claudine Hyppolite", role: "membre" },
      { id: 22, name: "Nadège Charlot", role: "membre" }
    ]
  },
  {
    title: "Éthique",
    members: [
      { id: 23, name: "Gérald Lerebours", role: "coordonnateur", isCoordinator: true }
    ]
  },
  {
    title: "Petites Annonces",
    members: [
      { id: 24, name: "Louis Franck Télémaque", role: "coordonnateur", isCoordinator: true }
    ]
  },
  {
    title: "Direction de lecture",
    members: [
      { id: 25, name: "Eunice Dérivois", role: "membre" }
    ]
  },
  {
    title: "Conception et réalisation",
    members: [
      { id: 26, name: "Jean Alouidor", role: "membre" }
    ]
  }
];
