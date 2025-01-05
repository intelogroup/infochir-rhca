export type BaseSortOption = {
  value: string;
  label: string;
};

export type IGMSortOption = {
  value: "latest" | "year" | "downloads" | "shares";
  label: string;
};

export type RHCASortOption = {
  value: "latest" | "views" | "citations";
  label: string;
};