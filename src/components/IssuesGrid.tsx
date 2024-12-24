import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Eye } from "lucide-react";

interface Issue {
  id: number;
  title: string;
  date: string;
  volume: string;
  abstract: string;
  downloadUrl: string;
}

const mockIssues: Issue[] = [
  {
    id: 1,
    title: "Innovations en Chirurgie Laparoscopique",
    date: "2024",
    volume: "Vol. 15, No. 1",
    abstract: "Une étude approfondie des nouvelles techniques en chirurgie mini-invasive...",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "Anesthésie en Chirurgie Pédiatrique",
    date: "2023",
    volume: "Vol. 14, No. 2",
    abstract: "Analyse comparative des protocoles d'anesthésie chez les patients pédiatriques...",
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "Gestion de la Douleur Post-Opératoire",
    date: "2023",
    volume: "Vol. 14, No. 1",
    abstract: "Évaluation des stratégies modernes de gestion de la douleur après une intervention chirurgicale...",
    downloadUrl: "#"
  },
  {
    id: 4,
    title: "Chirurgie Traumatologique d'Urgence",
    date: "2022",
    volume: "Vol. 13, No. 2",
    abstract: "Protocoles et techniques pour la prise en charge des traumatismes aigus...",
    downloadUrl: "#"
  }
];

export const IssuesGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIssues, setFilteredIssues] = useState(mockIssues);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockIssues.filter(issue =>
      issue.title.toLowerCase().includes(value.toLowerCase()) ||
      issue.abstract.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredIssues(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher des articles..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          Filtres
        </Button>
      </div>

      <div className="grid gap-6 max-w-5xl mx-auto scale-[0.7] origin-top">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2 text-primary group-hover:text-primary-light transition-colors">
                    {issue.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {issue.volume} • {issue.date}
                  </p>
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
                  Lire
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