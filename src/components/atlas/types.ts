
import { ArticleSource } from "@/components/index-medicus/types/article";

export type ChapterStatus = "available" | "coming";

export interface ChapterStats {
  views: number;
  shares: number;
  downloads: number;
}

export interface AtlasChapter {
  id: string;
  title: string;
  description?: string;
  abstract?: string;
  content?: string;
  lastUpdate?: string;
  lastUpdated?: string;
  publicationDate: string;
  author?: string;
  authors?: string[];
  status: ChapterStatus;
  coverImage?: string;
  stats?: ChapterStats;
  tags?: string[];
  volume?: string;
  specialty?: string;
  category?: string;
  source: ArticleSource;
  pdfUrl?: string;
  imageUrls?: string[];
  institution?: string;
  userId?: string;
  chapterNumber?: string;
}

export interface AtlasCategory {
  id: string;
  title: string;
  description?: string;
  chapters: string[];
  coverImage?: string;
  chapterCount?: number;
  lastUpdate?: string;
}
