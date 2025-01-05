import type { RHCASortOption } from "@/types/sort";

export const SORT_OPTIONS: readonly RHCASortOption[] = [
  { value: "latest", label: "Plus récents" },
  { value: "views", label: "Plus vus" },
  { value: "citations", label: "Plus cités" }
] as const;