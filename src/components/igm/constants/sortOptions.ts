import { IGMSortOption } from "@/types/sort";

export const SORT_OPTIONS: readonly IGMSortOption[] = [
  { value: "latest", label: "Plus récents" },
  { value: "year", label: "Par année" },
  { value: "downloads", label: "Téléchargements" },
  { value: "shares", label: "Partages" }
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];