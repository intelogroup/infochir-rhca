export type SortOption = {
  label: string;
  value: "date" | "views" | "citations" | "downloads";
};

export type RhcaArticle = {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  date: string;
  views?: number;
  citations?: number;
  downloads?: number;
  pageNumber: number;
  volume: number;
};