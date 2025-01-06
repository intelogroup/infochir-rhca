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
  tags?: string[];
}

export interface AtlasModalProps {
  chapter: AtlasChapter;
  category?: AtlasCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface AtlasCategory {
  id: string;
  title: string;
  chapters: string[];
}