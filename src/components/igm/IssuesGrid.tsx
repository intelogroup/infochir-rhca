import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { YearGroup } from "@/components/issues/YearGroup";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { sortIssues, groupIssuesByYear, getSortedYears } from "./utils/issueSorting";
import { filterIssues } from "./utils/issueFiltering";
import type { Issue } from "./types";

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "IGM Volume 7 - No 32",
    volume: "Volume 7",
    issue: "No 32",
    date: new Date(2020, 8, 15).toISOString(),
    abstract: "Numéro spécial sur les avancées en chirurgie mini-invasive",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample1.pdf",
    coverImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=700&fit=crop",
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
        tags: ["Chirurgie mini-invasive", "Innovation"]
      },
      {
        id: "1-2",
        title: "Évaluation des résultats post-opératoires",
        authors: ["Dr. Sophie Martin", "Dr. Jean-Paul Berger"],
        pageNumber: 15,
        abstract: "Analyse comparative des résultats à long terme",
        tags: ["Chirurgie", "Études cliniques"]
      }
    ]
  },
  {
    id: "2",
    title: "IGM Volume 7 - No 31",
    volume: "Volume 7",
    issue: "No 31",
    date: new Date(2020, 5, 15).toISOString(),
    abstract: "Focus sur l'anesthésie en chirurgie pédiatrique",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample2.pdf",
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=700&fit=crop",
    articleCount: 6,
    downloads: 98,
    shares: 32,
    articles: [
      {
        id: "2-1",
        title: "Spécificités de l'anesthésie pédiatrique",
        authors: ["Dr. Anne Dupont", "Dr. Marc Leblanc"],
        pageNumber: 1,
        abstract: "Revue des protocoles adaptés à la pédiatrie",
        tags: ["Anesthésie", "Pédiatrie"]
      },
      {
        id: "2-2",
        title: "Gestion de la douleur post-opératoire chez l'enfant",
        authors: ["Dr. Claire Dubois"],
        pageNumber: 18,
        abstract: "Nouvelles approches dans la gestion de la douleur",
        tags: ["Pédiatrie", "Gestion de la douleur"]
      }
    ]
  },
  {
    id: "3",
    title: "IGM Volume 7 - No 30",
    volume: "Volume 7",
    issue: "No 30",
    date: new Date(2020, 2, 1).toISOString(),
    abstract: "Les dernières innovations en chirurgie orthopédique",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample3.pdf",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=700&fit=crop",
    articleCount: 7,
    downloads: 156,
    shares: 67,
    articles: [
      {
        id: "3-1",
        title: "Innovations en chirurgie orthopédique",
        authors: ["Dr. Jean Martin", "Dr. Marie Rousseau"],
        pageNumber: 1,
        abstract: "Les dernières avancées technologiques en orthopédie",
        tags: ["Orthopédie", "Innovation"]
      },
      {
        id: "3-2",
        title: "Prothèses intelligentes : état de l'art",
        authors: ["Dr. Philippe Blanc"],
        pageNumber: 25,
        abstract: "Les nouvelles générations de prothèses connectées",
        tags: ["Orthopédie", "Technologies"]
      }
    ]
  },
  {
    id: "4",
    title: "IGM Volume 6 - No 29",
    volume: "Volume 6",
    issue: "No 29",
    date: new Date(2019, 11, 15).toISOString(),
    abstract: "Progrès en chirurgie cardiovasculaire",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample4.pdf",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=700&fit=crop",
    articleCount: 9,
    downloads: 178,
    shares: 89,
    articles: [
      {
        id: "4-1",
        title: "Avancées en chirurgie cardiovasculaire",
        authors: ["Dr. Sophie Richard", "Dr. Thomas Bernard"],
        pageNumber: 1,
        abstract: "Les nouvelles techniques mini-invasives en cardiologie",
        tags: ["Cardiovasculaire", "Innovation"]
      },
      {
        id: "4-2",
        title: "Imagerie cardiaque en temps réel",
        authors: ["Dr. Laurent Petit"],
        pageNumber: 30,
        abstract: "Applications de l'IA en imagerie cardiaque",
        tags: ["Imagerie", "Intelligence artificielle"]
      }
    ]
  },
  {
    id: "5",
    title: "IGM Volume 6 - No 28",
    volume: "Volume 6",
    issue: "No 28",
    date: new Date(2019, 8, 15).toISOString(),
    abstract: "Actualités en médecine interne",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample5.pdf",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=700&fit=crop",
    articleCount: 7,
    downloads: 134,
    shares: 56,
    articles: [
      {
        id: "5-1",
        title: "Nouvelles approches en médecine interne",
        authors: ["Dr. Marie Dubois", "Dr. Jean Moreau"],
        pageNumber: 1,
        abstract: "Évolution des pratiques en médecine interne",
        tags: ["Médecine interne", "Innovation"]
      },
      {
        id: "5-2",
        title: "Prise en charge des maladies chroniques",
        authors: ["Dr. Claire Martin"],
        pageNumber: 22,
        abstract: "Stratégies innovantes dans le suivi des patients",
        tags: ["Maladies chroniques", "Suivi patient"]
      }
    ]
  },
  {
    id: "6",
    title: "IGM Volume 6 - No 27",
    volume: "Volume 6",
    issue: "No 27",
    date: new Date(2019, 6, 1).toISOString(),
    abstract: "Spécial Neurologie et Neurosciences",
    description: "Édité par Dr. Jean Alouidor",
    pdfUrl: "https://example.com/sample6.pdf",
    coverImage: "https://images.unsplash.com/photo-1559757175-7b21e7ecc8dd?w=500&h=700&fit=crop",
    articleCount: 8,
    downloads: 167,
    shares: 78,
    articles: [
      {
        id: "6-1",
        title: "Avancées en neuroimagerie",
        authors: ["Dr. Pierre Lambert", "Dr. Sophie Girard"],
        pageNumber: 1,
        abstract: "Les dernières technologies en imagerie cérébrale",
        tags: ["Neurologie", "Imagerie"]
      },
      {
        id: "6-2",
        title: "Traitement des troubles neurologiques",
        authors: ["Dr. Marc Bernard"],
        pageNumber: 28,
        abstract: "Nouvelles approches thérapeutiques",
        tags: ["Neurologie", "Thérapeutique"]
      }
    ]
  }
];

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = ({ viewMode = "grid" }: IssuesGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredIssues = useMemo(() => {
    return filterIssues(mockIssues, searchTerm);
  }, [searchTerm]);

  const sortedIssues = useMemo(() => {
    return sortIssues(filteredIssues, sortBy);
  }, [filteredIssues, sortBy]);

  const issuesByYear = useMemo(() => {
    return groupIssuesByYear(sortedIssues);
  }, [sortedIssues]);

  const sortedYears = useMemo(() => {
    return getSortedYears(issuesByYear);
  }, [issuesByYear]);

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
