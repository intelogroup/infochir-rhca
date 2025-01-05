export type SortOption = {
  label: string;
  value: "date" | "views" | "citations" | "downloads";
};

export type SortOptionType = {
  label: string;
  value: SortOption;
};