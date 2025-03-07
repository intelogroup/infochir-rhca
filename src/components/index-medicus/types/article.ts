
export interface Article {
  id: string;
  title: string;
  authors?: string[];
  pageNumber?: string | number;
  abstract?: string;
  tags?: string[];
}
