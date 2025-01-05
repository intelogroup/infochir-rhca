import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { YearGroup } from "@/components/issues/YearGroup";
import { toast } from "@/hooks/use-toast";
import type { Issue } from "@/components/issues/types";

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "IGM",
    volume: "Volume 3",
    issue: "No 41",
    date: new Date(2024, 8, 1).toISOString(), // September 2024
    abstract: "Édition spéciale sur les avancées en médecine tropicale. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=700&fit=crop",
    articleCount: 12,
  },
  {
    id: "2",
    title: "IGM",
    volume: "Volume 3",
    issue: "No 40",
    date: new Date(2024, 5, 1).toISOString(), // June 2024
    abstract: "Focus sur les maladies infectieuses émergentes. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=700&fit=crop",
    articleCount: 8,
  },
  {
    id: "3",
    title: "IGM",
    volume: "Volume 3",
    issue: "No 39",
    date: new Date(2024, 2, 1).toISOString(), // March 2024
    abstract: "Numéro sur la santé publique en Haïti. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=500&h=700&fit=crop",
    articleCount: 10,
  },
  {
    id: "4",
    title: "IGM",
    volume: "Volume 2",
    issue: "No 38",
    date: new Date(2023, 11, 1).toISOString(), // December 2023
    abstract: "Recherches sur la médecine préventive. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&h=700&fit=crop",
    articleCount: 9,
  },
  {
    id: "5",
    title: "IGM",
    volume: "Volume 2",
    issue: "No 37",
    date: new Date(2023, 8, 1).toISOString(), // September 2023
    abstract: "Innovations en cardiologie. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=500&h=700&fit=crop",
    articleCount: 11,
  },
  {
    id: "6",
    title: "IGM",
    volume: "Volume 2",
    issue: "No 36",
    date: new Date(2023, 5, 1).toISOString(), // June 2023
    abstract: "Actualités en pédiatrie. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=500&h=700&fit=crop",
    articleCount: 7,
  },
  {
    id: "7",
    title: "IGM",
    volume: "Volume 1",
    issue: "No 35",
    date: new Date(2022, 11, 1).toISOString(), // December 2022
    abstract: "Progrès en neurologie. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=500&h=700&fit=crop",
    articleCount: 10,
  },
  {
    id: "8",
    title: "IGM",
    volume: "Volume 1",
    issue: "No 34",
    date: new Date(2022, 8, 1).toISOString(), // September 2022
    abstract: "Études sur la médecine tropicale. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=500&h=700&fit=crop",
    articleCount: 8,
  },
];

export const IssuesGrid = ({ viewMode = "grid" }: { viewMode?: "grid" | "table" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Enhanced search with memoization
  const filteredIssues = useMemo(() => {
    const filtered = mockIssues.filter((issue) => {
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
  }, [searchTerm]);

  // Enhanced sorting logic
  const sortIssues = (issues: Issue[], sortType: string) => {
    let sorted = [...issues];
    switch (sortType) {
      case "latest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "year":
        sorted.sort((a, b) => 
          new Date(b.date).getFullYear() - new Date(a.date).getFullYear()
        );
        break;
      case "month":
        sorted.sort((a, b) => 
          new Date(b.date).getMonth() - new Date(a.date).getMonth()
        );
        break;
      case "articles":
        sorted.sort((a, b) => 
          (b.articleCount || 0) - (a.articleCount || 0)
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  const sortedIssues = sortIssues(filteredIssues, sortBy);

  // Group issues by year when in grid view
  const issuesByYear = sortedIssues.reduce((acc, issue) => {
    const year = new Date(issue.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(issue);
    return acc;
  }, {} as Record<number, Issue[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(issuesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={[
          { value: "latest", label: "Plus récents" },
          { value: "year", label: "Année" },
          { value: "month", label: "Mois" },
          { value: "articles", label: "Nombre d'articles" },
        ]}
      />
      
      {viewMode === "grid" ? (
        <div className="space-y-6">
          {sortedYears.map((year) => (
            <YearGroup
              key={year}
              year={year}
              issues={issuesByYear[year]}
            />
          ))}
        </div>
      ) : (
        <IssuesTable issues={sortedIssues} />
      )}
    </div>
  );
};