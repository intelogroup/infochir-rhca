
export interface CarouselItem {
  id: string;
  title: string;
  description?: string;
  abstract?: string;
  image: string;
  author?: string;
  date?: string;
  category?: string;
  pdfUrl?: string;
  source?: string; // Add source property for routing
  link?: string; // Add link property for navigation
  type: 'article' | 'event' | 'training';
}

export interface CarouselSection {
  title: string;
  subtitle?: string;
  items: CarouselItem[];
}
