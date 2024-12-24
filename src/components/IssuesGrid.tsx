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
  {
    id: 1,
    title: "Avancées en Médecine Tropicale",
    volume: "Volume 24",
    issue: "Issue 4",
    year: 2024,
    month: 3,
    abstract: "Cette édition présente les dernières découvertes dans le domaine de la médecine tropicale, incluant de nouvelles approches thérapeutiques...",
    pdfUrl: "#",
    articleCount: 12
  },
  {
    id: 2,
    title: "Recherches en Immunologie",
    volume: "Volume 24",
    issue: "Issue 3",
    year: 2024,
    month: 2,
    abstract: "Un numéro spécial dédié aux avancées récentes en immunologie, avec un focus particulier sur les maladies auto-immunes...",
    pdfUrl: "#",
    articleCount: 15
  },
  {
    id: 3,
    title: "Études Cliniques en Cardiologie",
    volume: "Volume 24",
    issue: "Issue 2",
    year: 2024,
    month: 1,
    abstract: "Collection d'études cliniques majeures en cardiologie interventionnelle et préventive...",
    pdfUrl: "#",
    articleCount: 10
  },
  {
    id: 4,
    title: "Perspectives en Neurologie",
    volume: "Volume 24",
    issue: "Issue 1",
    year: 2024,
    month: 1,
    abstract: "Synthèse des dernières recherches en neurologie, incluant des études sur les maladies neurodégénératives...",
    pdfUrl: "#",
    articleCount: 8
  },
  {
    id: 5,
    title: "Innovations en Chirurgie",
    volume: "Volume 23",
    issue: "Issue 12",
    year: 2023,
    month: 12,
    abstract: "Présentation des techniques chirurgicales innovantes et des résultats d'études multicentriques...",
    pdfUrl: "#",
    articleCount: 14
  },
  {
    id: 6,
    title: "Médecine Préventive",
    volume: "Volume 23",
    issue: "Issue 11",
    year: 2023,
    month: 11,
    abstract: "Focus sur les stratégies de prévention et la santé publique, incluant des études épidémiologiques...",
    pdfUrl: "#",
    articleCount: 11
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
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

      <div className="grid gap-6 max-w-5xl mx-auto">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2 text-primary">
                    {issue.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{issue.volume} • {issue.issue}</span>
                    <span className="text-primary">|</span>
                    <Calendar className="h-4 w-4" />
                    <span>{issue.month}/
                    {issue.year}</span>
                    <span className="text-primary">|</span>
                    <span>{issue.articleCount} articles</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                {issue.abstract}
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Consulter
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};