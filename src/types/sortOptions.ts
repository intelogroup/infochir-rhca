export type SortOption = "latest" | "year" | "downloads" | "shares";

export type SortOptionType = {
  value: SortOption;
  label: string;
};

export const SORT_OPTIONS: readonly SortOptionType[] = [
  { value: "latest", label: "Plus récents" },
  { value: "year", label: "Par année" },
  { value: "downloads", label: "Téléchargements" },
  { value: "shares", label: "Partages" },
] as const;