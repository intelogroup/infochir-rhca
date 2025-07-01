
export interface AtlasChapter {
  id: string;
  title: string;
  description?: string;
  category?: string;
  chapterNumber?: number;
  pageNumber?: string; // Added missing pageNumber property
  authors?: string[];
  author?: string; // Adding for backwards compatibility
  pdfUrl?: string;
  coverImageUrl?: string;
  coverImage?: string; // Adding for backwards compatibility
  lastUpdate?: string;
  lastUpdated?: string;
  publicationDate?: string; // Added missing property
  abstract?: string; // Added missing property
  status?: 'available' | 'coming-soon' | 'unavailable' | 'coming'; // Added 'coming' as a valid status
  tags?: string[];
  stats?: {
    views?: number;
    shares?: number;
    downloads?: number;
  };
  source?: string;
  primary_author?: string; // Added missing property
  co_authors?: string[]; // Added missing property
  issue?: string; // Added missing property for sorting
  volume?: string; // Added missing property
  specialty?: string; // Added missing property
  institution?: string; // Added missing property
}

export interface AtlasTableOfContentsProps {
  chapters?: AtlasChapter[];
}

export interface AtlasSidebarProps {
  chapters?: AtlasChapter[];
}
