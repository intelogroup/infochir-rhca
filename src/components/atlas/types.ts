export interface AtlasChapter {
  id: string;
  title: string;
  description?: string;
  lastUpdate?: string;
  author?: string;
  status: "available" | "coming";
}