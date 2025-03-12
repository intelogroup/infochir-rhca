
export interface CarouselItem {
  id?: string;
  title: string;
  description: string;
  image: string;
  date?: string;
  category?: string;
  author?: string;
  link: string;
}

export type Highlight = CarouselItem;
