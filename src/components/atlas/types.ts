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
  lastUpdate?: string;
  author?: string;
  status: ChapterStatus;
  coverImage?: string;
  stats?: ChapterStats;
}

export interface AtlasModalProps {
  chapter: AtlasChapter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}