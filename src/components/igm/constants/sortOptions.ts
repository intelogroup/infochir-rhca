
import type { SortOption } from "../types";

export const sortOptions = [
  { label: "Les plus récents", value: "latest" as SortOption },
  { label: "Par année", value: "year" as SortOption },
  { label: "Téléchargements", value: "downloads" as SortOption },
  { label: "Partages", value: "shares" as SortOption },
];

// For backward compatibility
export const SORT_OPTIONS = sortOptions;
