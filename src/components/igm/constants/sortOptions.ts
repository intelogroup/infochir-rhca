export const SORT_OPTIONS = [
  { value: "latest", label: "Plus récents" },
  { value: "year", label: "Année" },
  { value: "downloads", label: "Téléchargements" },
  { value: "shares", label: "Partages" },
] as const;

export type SortOption = typeof SORT_OPTIONS[number]["value"];