
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
    title: "Traumatisme",
    chapters: ["1", "2"]
  },
  {
    id: "skin",
    title: "Peau et tissus sous-cutanés",
    chapters: ["3", "4", "5"]
  },
  {
    id: "breast",
    title: "Sein",
    chapters: ["6", "7"]
  },
  {
    id: "thoracic",
    title: "Thoracique et Vasculaire",
    chapters: ["8", "9"]
  },
  {
    id: "digestive",
    title: "Digestif",
    chapters: ["10", "11", "12", "13", "14"]
  },
  {
    id: "urogenital",
    title: "Uro-génital",
    chapters: ["15", "16", "17"]
  },
  {
    id: "orthopedic",
    title: "Orthopédie",
    chapters: ["18", "19"]
  },
  {
    id: "neurosurgery",
    title: "Neurochirurgie",
    chapters: ["20", "21"]
  },
  {
    id: "pediatric",
    title: "Pédiatrie",
    chapters: ["22", "23"]
  }
];
