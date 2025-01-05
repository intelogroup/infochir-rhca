export type BaseSortOption = {
  value: string;
  label: string;
};

export type IGMSortOption = "latest" | "year" | "downloads" | "shares";

export type RHCASortOption = "latest" | "views" | "citations";

export const IGM_SORT_OPTIONS = [
  { value: "latest", label: "Plus récents" },
  { value: "year", label: "Par année" },
  { value: "downloads", label: "Téléchargements" },
  { value: "shares", label: "Partages" }
] as const;

export const RHCA_SORT_OPTIONS = [
  { value: "latest", label: "Plus récents" },
  { value: "views", label: "Plus vus" },
  { value: "citations", label: "Plus cités" }
] as const;