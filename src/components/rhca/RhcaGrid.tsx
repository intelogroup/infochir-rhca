import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { RhcaCard } from "./RhcaCard";
import { RhcaTable } from "./RhcaTable";
import { toast } from "@/hooks/use-toast";
import type { RhcaArticle } from "./types";

const mockArticles: RhcaArticle[] = [
  {
    id: "1",
    title: "ÉDITORIAL",
    authors: ["Comité éditorial"],
    abstract: "Éditorial du numéro 47 de la revue INFOCHIR-RHCA",
    date: new Date(2024, 6, 1).toISOString(),
    pageNumber: 4,
    tags: ["éditorial"],
    views: 120,
    citations: 5,
    downloads: 45
  },
  {
    id: "2",
    title: "Lymphadénite tuberculeuse cervicale associée à une anémie chronique, à propos d'un cas",
    authors: ["Eunice DERIVOIS MERISIER", "et al"],
    abstract: "Étude de cas sur la lymphadénite tuberculeuse cervicale et ses complications",
    date: new Date(2024, 6, 1).toISOString(),
    pageNumber: 5,
    tags: ["tuberculose", "anémie", "cas clinique"],
    views: 85,
    citations: 3,
    downloads: 30
  },
  // ... Add more mock articles based on your content
];

interface RhcaGridProps {
  viewMode?: "grid" | "table";
}

export const RhcaGrid = ({ viewMode = "grid" }: RhcaGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredArticles = useMemo(() => {
    const filtered = mockArticles.filter((article) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        article.title.toLowerCase().includes(searchLower) ||
        article.abstract.toLowerCase().includes(searchLower) ||
        article.authors.some(author => 
          author.toLowerCase().includes(searchLower)
        ) ||
        article.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        )
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
  }, [searchTerm]);

  const sortArticles = (articles: RhcaArticle[], sortType: string) => {
    let sorted = [...articles];
    switch (sortType) {
      case "latest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "views":
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "citations":
        sorted.sort((a, b) => (b.citations || 0) - (a.citations || 0));
        break;
      default:
        break;
    }
    return sorted;
  };

  const sortedArticles = sortArticles(filteredArticles, sortBy);

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={[
          { value: "latest", label: "Plus récents" },
          { value: "views", label: "Plus vus" },
          { value: "citations", label: "Plus cités" },
        ]}
      />
      
      {viewMode === "grid" ? (
        <div className="space-y-4">
          {sortedArticles.map((article) => (
            <RhcaCard
              key={article.id}
              article={article}
            />
          ))}
        </div>
      ) : (
        <RhcaTable articles={sortedArticles} />
      )}
    </div>
  );
};