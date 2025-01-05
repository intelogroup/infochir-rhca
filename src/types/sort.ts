export type BaseSortOption = {
  value: string;
  label: string;
};

export type IGMSortOptionValue = "latest" | "year" | "downloads" | "shares";
export type RHCASortOptionValue = "latest" | "views" | "citations";

export type IGMSortOption = BaseSortOption & {
  value: IGMSortOptionValue;
};

export type RHCASortOption = BaseSortOption & {
  value: RHCASortOptionValue;
};

export const IGM_SORT_OPTIONS: readonly IGMSortOption[] = [
  { value: "latest", label: "Plus récents" },
  { value: "year", label: "Par année" },
  { value: "downloads", label: "Téléchargements" },
  { value: "shares", label: "Partages" }
] as const;

export const RHCA_SORT_OPTIONS: readonly RHCASortOption[] = [
  { value: "latest", label: "Plus récents" },
  { value: "views", label: "Plus vus" },
  { value: "citations", label: "Plus cités" }
] as const;