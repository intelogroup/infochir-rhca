
export interface IGMEditorialMember {
  name: string;
  role?: string;
  isCoordinator?: boolean;
}

export interface IGMEditorialSection {
  title: string;
  members: IGMEditorialMember[];
}

export const igmEditorialData: IGMEditorialSection[] = [
  {
    title: "Rédaction et de l'Éditorial",
    members: [
      { name: "Michel Dodard", role: "directeur", isCoordinator: true },
      { name: "Maxime Coles", role: "conseiller" }
    ]
  },
  {
    title: "Lu pour vous",
    members: [
      { name: "Michel Dodard", role: "coordonnateur", isCoordinator: true },
      { name: "Ernst Jean Baptiste", role: "membre" },
      { name: "Henry Jean-Baptiste", role: "membre" }
    ]
  },
  {
    title: "Santé Publique",
    members: [
      { name: "Pavel Desrosiers", role: "coordonnateur", isCoordinator: true },
      { name: "Franck Généus", role: "membre" },
      { name: "Guirlaine Raymond", role: "membre" },
      { name: "Chesnel Norcéide", role: "membre" },
      { name: "Mario Laroche", role: "membre" }
    ]
  },
  {
    title: "Actualités Intra Hospitalières",
    members: [
      { name: "Christophe Millien", role: "coordonnateur", isCoordinator: true },
      { name: "Wilfine Dupont", role: "membre" },
      { name: "Pierre-Marie Woolley", role: "membre" },
      { name: "Vanessa Jaelle Dor", role: "membre" }
    ]
  },
  {
    title: "Académie et Professions",
    members: [
      { name: "Edith C. Georges", role: "coordonnatrice", isCoordinator: true },
      { name: "Marlyn Lestage-Laforest", role: "membre" },
      { name: "Carine Réveil Jean-Baptiste", role: "membre" }
    ]
  },
  {
    title: "Informations Socio Culturelles",
    members: [
      { name: "Jessy Colimon Adrien", role: "coordonnatrice", isCoordinator: true },
      { name: "Judith Jean-Baptiste", role: "adjointe" },
      { name: "Wisly Joseph", role: "membre" },
      { name: "Claudine Hyppolite", role: "membre" },
      { name: "Nadège Charlot", role: "membre" }
    ]
  },
  {
    title: "Éthique",
    members: [
      { name: "Gérald Lerebours", role: "coordonnateur", isCoordinator: true }
    ]
  },
  {
    title: "Petites Annonces",
    members: [
      { name: "Louis Franck Télémaque", role: "coordonnateur", isCoordinator: true }
    ]
  },
  {
    title: "Direction de lecture",
    members: [
      { name: "Eunice Dérivois", role: "membre" }
    ]
  },
  {
    title: "Conception et réalisation",
    members: [
      { name: "Jean Alouidor", role: "membre", isCoordinator: false },
    ]
  }
];

export const igmEditorInChief = {
  name: "Jean Alouidor",
  role: "Editeur en chef"
};
