export interface AtlasChapter {
  id: string;
  title: string;
  description?: string;
  lastUpdate?: string;
  author?: string;
  status: "available" | "coming";
  stats?: {
    views: number;
    shares: number;
    downloads: number;
  };
}

export interface AtlasModalProps {
  chapter: AtlasChapter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}