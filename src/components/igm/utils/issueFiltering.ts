import type { Issue } from "../types";
import { toast } from "@/hooks/use-toast";

export const filterIssues = (issues: Issue[], searchTerm: string) => {
  const filtered = issues.filter((issue) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      issue.title.toLowerCase().includes(searchLower) ||
      issue.abstract.toLowerCase().includes(searchLower) ||
      issue.description?.toLowerCase().includes(searchLower) ||
      issue.volume.toLowerCase().includes(searchLower) ||
      issue.issue.toLowerCase().includes(searchLower)
    );
  });

  if (filtered.length === 0 && searchTerm !== "") {
    toast({
      title: "Aucun résultat",
      description: "Essayez de modifier vos critères de recherche",
      variant: "destructive",
    });
  }

  return filtered;
};