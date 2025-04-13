
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
  
  // Additional properties used in the components
  abstract?: string;
  author?: string;
  authors?: string[];
  publicationDate?: string;
  status?: 'available' | 'coming';
  coverImage?: string;
  pdfUrl?: string;
  tags?: string[];
  stats?: {
    views: number;
    shares: number;
    downloads: number;
  };
  imageUrls?: string[];
  institution?: string;
  userId?: string;
  source?: string;
  volume?: string;
  specialty?: string;
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
