
export interface AtlasChapter {
  id: string;
  title: string;
  description?: string;
  category?: string;
  chapterNumber?: number;
  authors?: string[];
  pdfUrl?: string;
  coverImageUrl?: string;
  lastUpdate?: string;
  lastUpdated?: string;
  status?: 'available' | 'coming-soon' | 'unavailable';
  tags?: string[];
}

export interface AtlasTableOfContentsProps {
  chapters?: AtlasChapter[];
}

export interface AtlasSidebarProps {
  chapters?: AtlasChapter[];
}
