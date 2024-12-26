import { useState } from "react";
import { useArticles } from "@/hooks/use-articles";
import { IssuesSearch } from "./issues/IssuesSearch";
import { IssuesList } from "./issues/IssuesList";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const IssuesGrid = () => {
  const { error, filteredIssues, setFilteredIssues, refreshArticles } = useArticles();
  const [searchTerm, setSearchTerm] = useState("");

  const handleRefresh = async () => {
    try {
      await refreshArticles();
      toast.success("Articles rafraîchis avec succès");
    } catch (error) {
      console.error("Error refreshing articles:", error);
      toast.error("Erreur lors du rafraîchissement des articles");
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Une erreur est survenue lors du chargement des articles.</span>
          <button 
            onClick={handleRefresh}
            className="text-primary hover:underline flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Réessayer
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!Array.isArray(filteredIssues)) {
    console.error("filteredIssues must be an array");
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur est survenue lors du traitement des données.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <IssuesSearch
        onSearch={setSearchTerm}
        filteredIssues={filteredIssues}
        setFilteredIssues={setFilteredIssues}
      />
      <IssuesList issues={filteredIssues} />
    </div>
  );
};