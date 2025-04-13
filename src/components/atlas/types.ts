
export interface AtlasChapter {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  content?: string;
  category?: string;
  articleCount?: number;
  isNew?: boolean;
  isUpdated?: boolean;
  lastUpdated?: string;
  sections?: ChapterSection[];
}

export interface ChapterSection {
  id: string;
  title: string;
  content: string;
  subsections?: ChapterSubsection[];
}

export interface ChapterSubsection {
  id: string;
  title: string;
  content: string;
}

export interface AtlasCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  chapters: AtlasChapter[];
}

export type ChapterView = 'grid' | 'list';
