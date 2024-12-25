import { useState } from "react";
import { useArticles } from "@/hooks/use-articles";
import { IssuesSearch } from "./issues/IssuesSearch";
import { IssuesList } from "./issues/IssuesList";
import { Skeleton } from "@/components/ui/skeleton";

export const IssuesGrid = () => {
  const { isLoading, error, filteredIssues, setFilteredIssues, refreshArticles } = useArticles();
  const [searchTerm, setSearchTerm] = useState("");

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Une erreur est survenue lors du chargement des articles.</p>
        <button 
          onClick={refreshArticles}
          className="mt-4 text-primary hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <IssuesSearch
        onSearch={setSearchTerm}
        filteredIssues={filteredIssues}
        setFilteredIssues={setFilteredIssues}
      />
      <IssuesList issues={filteredIssues} />
    </div>
  );
};