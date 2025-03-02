import type { Article } from "../index-medicus/types";

export interface RhcaArticle extends Article {
  pdfFileName?: string;
  coverImageFileName?: string;
  image_url?: string; // Add this to fix the type errors in RhcaCard and RhcaTable
}

export interface RhcaVolume {
  id: string;
  title: string;
  volume: string;
  issue: string;
  date: string;
  year: string;
  coverImage?: string;
  pdfUrl?: string;
  articles?: RhcaArticle[];
  specialty?: string;
  category?: string;
  institution?: string;
  editor?: string;
  pageCount?: string;
  availability?: "available" | "unavailable" | "coming_soon";
  // Add missing properties that are referenced in code
  description?: string;
  articleCount?: number;
  downloadCount?: number;
  shareCount?: number;
}
