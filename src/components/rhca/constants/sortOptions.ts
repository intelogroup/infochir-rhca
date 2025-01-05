import { RHCASortOption } from "@/types/sort";

export const RHCA_SORT_OPTIONS: readonly RHCASortOption[] = [
  { value: "latest", label: "Plus récents" },
  { value: "views", label: "Plus vus" },
  { value: "citations", label: "Plus cités" },
] as const;

export type RHCASortOption = (typeof RHCA_SORT_OPTIONS)[number]["value"];