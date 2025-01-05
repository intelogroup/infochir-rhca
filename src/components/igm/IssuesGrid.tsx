import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { YearGroup } from "@/components/issues/YearGroup";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { toast } from "@/hooks/use-toast";
import type { Issue } from "./types";

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Info CHIR",
    volume: "Volume 7",
    issue: "No 32",
    date: new Date(2020, 8, 15).toISOString(),
    abstract: "Numéro spécial sur les avancées en chirurgie mini-invasive",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample1.pdf",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=700&fit=crop",
    articleCount: 8,
    downloads: 125,
    shares: 45,
    articles: [
      {
        id: "1-1",
        title: "Les nouvelles techniques en chirurgie mini-invasive",
        authors: ["Dr. Marie Laurent", "Dr. Pierre Dubois"],
        pageNumber: 1,
        abstract: "Une revue des dernières avancées en chirurgie mini-invasive",
        tags: ["Chirurgie mini-invasive", "Innovation", "Techniques chirurgicales"]
      },
      {
        id: "1-2",
        title: "Impact de la chirurgie mini-invasive sur la récupération post-opératoire",
        authors: ["Dr. Jean Martin", "Dr. Sophie Richard"],
        pageNumber: 15,
        tags: ["Récupération post-opératoire", "Étude clinique"]
      }
    ]
  },
  {
    id: "2",
    title: "Info CHIR",
    volume: "Volume 7",
    issue: "No 31",
    date: new Date(2020, 5, 15).toISOString(),
    abstract: "Focus sur l'anesthésie en chirurgie pédiatrique",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample2.pdf",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=700&fit=crop",
    articleCount: 6,
    downloads: 98,
    shares: 32,
    articles: [
      {
        id: "2-1",
        title: "Spécificités de l'anesthésie pédiatrique",
        authors: ["Dr. Anne Dupont", "Dr. Marc Bernard"],
        pageNumber: 1,
        tags: ["Anesthésie", "Pédiatrie"]
      }
    ]
  },
  {
    id: "3",
    title: "IGM",
    volume: "Volume 3",
    issue: "No 39",
    date: new Date(2024, 2, 1).toISOString(),
    abstract: "Numéro sur la santé publique en Haïti. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=500&h=700&fit=crop",
    articleCount: 10,
    articles: []
  },
  {
    id: "4",
    title: "IGM",
    volume: "Volume 2",
    issue: "No 38",
    date: new Date(2023, 11, 1).toISOString(),
    abstract: "Recherches sur la médecine préventive. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&h=700&fit=crop",
    articleCount: 9,
    articles: []
  },
  {
    id: "5",
    title: "IGM",
    volume: "Volume 2",
    issue: "No 37",
    date: new Date(2023, 8, 1).toISOString(),
    abstract: "Innovations en cardiologie. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=500&h=700&fit=crop",
    articleCount: 11,
    articles: []
  },
  {
    id: "6",
    title: "IGM",
    volume: "Volume 2",
    issue: "No 36",
    date: new Date(2023, 5, 1).toISOString(),
    abstract: "Actualités en pédiatrie. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=500&h=700&fit=crop",
    articleCount: 7,
    articles: []
  },
  {
    id: "7",
    title: "IGM",
    volume: "Volume 1",
    issue: "No 35",
    date: new Date(2022, 11, 1).toISOString(),
    abstract: "Progrès en neurologie. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=500&h=700&fit=crop",
    articleCount: 10,
    articles: []
  },
  {
    id: "8",
    title: "IGM",
    volume: "Volume 1",
    issue: "No 34",
    date: new Date(2022, 8, 1).toISOString(),
    abstract: "Études sur la médecine tropicale. Édité par Dr. Jean Alouidor",
    description: "Dr. Jean Alouidor",
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=500&h=700&fit=crop",
    articleCount: 8,
    articles: []
  }
];

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = ({ viewMode = "grid" }: IssuesGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

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
      case "downloads":
        sorted.sort((a, b) => 
          (b.downloads || 0) - (a.downloads || 0)
        );
        break;
      case "shares":
        sorted.sort((a, b) => 
          (b.shares || 0) - (a.shares || 0)
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  const sortedIssues = sortIssues(filteredIssues, sortBy);

  const issuesByYear = sortedIssues.reduce((acc, issue) => {
    const year = new Date(issue.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(issue);
    return acc;
  }, {} as Record<number, Issue[]>);

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
          { value: "downloads", label: "Téléchargements" },
          { value: "shares", label: "Partages" },
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
