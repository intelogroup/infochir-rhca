export interface Article {
  id: string;
  title: string;
  authors: string[];
  date: string;
  category: string;
  source: "RHCA" | "IGM" | "ADC";
  abstract: string;
  tags: string[];
  imageUrl?: string;
}