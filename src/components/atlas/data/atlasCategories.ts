export type AtlasCategory = {
  id: string;
  title: string;
  chapters: string[];
};

export const atlasCategories: AtlasCategory[] = [
  {
    id: "intro",
    title: "Introduction",
    chapters: ["0"]
  },
  {
    id: "trauma",
    title: "Traumatologie",
    chapters: ["1", "2"]
  },
  {
    id: "specialties",
    title: "Spécialités",
    chapters: ["3", "4", "5"]
  },
  {
    id: "thoracic",
    title: "Thoracique et Vasculaire",
    chapters: ["6", "7", "8", "9"]
  },
  {
    id: "digestive",
    title: "Digestif",
    chapters: ["10", "11", "12", "13", "14"]
  },
  {
    id: "specialized",
    title: "Chirurgies Spécialisées",
    chapters: ["15", "16", "17", "18", "19"]
  },
  {
    id: "other",
    title: "Autres",
    chapters: ["20", "21", "22", "23"]
  }
];