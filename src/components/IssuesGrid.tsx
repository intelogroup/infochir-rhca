import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Eye, Calendar } from "lucide-react";

interface Issue {
  id: number;
  title: string;
  volume: string;
  issue: string;
  year: number;
  month: number;
  abstract: string;
  pdfUrl: string;
  articleCount: number;
}

const mockIssues: Issue[] = [
  // 2024 Issues
  {
    id: 1,
    title: "Avancées en Immunothérapie",
    volume: "Volume 25",
    issue: "Issue 1",
    year: 2024,
    month: 3,
    abstract: "Nouvelles approches en immunothérapie et résultats cliniques...",
    pdfUrl: "#",
    articleCount: 14
  },
  {
    id: 2,
    title: "Maladies Infectieuses Émergentes",
    volume: "Volume 25",
    issue: "Issue 2",
    year: 2024,
    month: 2,
    abstract: "Études sur les pathogènes émergents et stratégies de contrôle...",
    pdfUrl: "#",
    articleCount: 12
  },
  // 2023 Issues
  {
    id: 3,
    title: "Oncologie Moléculaire",
    volume: "Volume 24",
    issue: "Issue 12",
    year: 2023,
    month: 12,
    abstract: "Dernières avancées en oncologie moléculaire...",
    pdfUrl: "#",
    articleCount: 15
  },
  {
    id: 4,
    title: "Neurologie Clinique",
    volume: "Volume 24",
    issue: "Issue 11",
    year: 2023,
    month: 11,
    abstract: "Recherches en neurologie clinique et thérapeutique...",
    pdfUrl: "#",
    articleCount: 10
  },
  {
    id: 5,
    title: "Cardiologie Interventionnelle",
    volume: "Volume 24",
    issue: "Issue 10",
    year: 2023,
    month: 10,
    abstract: "Innovations en cardiologie interventionnelle...",
    pdfUrl: "#",
    articleCount: 13
  }
];

export const IssuesGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filteredIssues, setFilteredIssues] = useState(mockIssues);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockIssues.filter(issue =>
      issue.title.toLowerCase().includes(value.toLowerCase()) ||
      issue.abstract.toLowerCase().includes(value.toLowerCase())
    );
    sortIssues(filtered, sortBy);
  };

  const sortIssues = (issues: Issue[], sortType: string) => {
    let sorted = [...issues];
    switch (sortType) {
      case "latest":
        sorted.sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month));
        break;
      case "year":
        sorted.sort((a, b) => b.year - a.year);
        break;
      case "month":
        sorted.sort((a, b) => b.month - a.month);
        break;
      default:
        break;
    }
    setFilteredIssues(sorted);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    sortIssues(filteredIssues, value);
  };

  // Group issues by year
  const issuesByYear = filteredIssues.reduce((acc, issue) => {
    if (!acc[issue.year]) {
      acc[issue.year] = [];
    }
    acc[issue.year].push(issue);
    return acc;
  }, {} as Record<number, Issue[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(issuesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher des volumes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={handleSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Plus récents</SelectItem>
            <SelectItem value="year">Année</SelectItem>
            <SelectItem value="month">Mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-8">
        {sortedYears.map((year) => (
          <div key={year} className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-4">{year}</h2>
            <div className="grid gap-4">
              {issuesByYear[year].map((issue) => (
                <Card key={issue.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-1 text-primary">
                          {issue.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{issue.volume} • {issue.issue}</span>
                          <span className="text-primary">|</span>
                          <Calendar className="h-3 w-3" />
                          <span>{issue.month}/{issue.year}</span>
                          <span className="text-primary">|</span>
                          <span>{issue.articleCount} articles</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-3 w-3" />
                          Consulter
                        </Button>
                        <Button size="sm" className="gap-1">
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};