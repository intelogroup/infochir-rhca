import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { VolumeCard } from "./VolumeCard";
import { RhcaArticleList } from "./RhcaArticleList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { RhcaVolume, RhcaArticle } from "./types";

const mockVolumes: RhcaVolume[] = [
  {
    id: "1",
    volume: "47",
    date: new Date(2024, 6, 1).toISOString(),
    description: "Volume 47 de la revue INFOCHIR-RHCA",
    articleCount: 5,
    articles: [
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
        downloads: 45,
        volume: "47"
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
        downloads: 30,
        volume: "47"
      },
      {
        id: "3",
        title: "Corps étranger bronchique chez l'enfant, à propos d'un cas",
        authors: ["Patrick Marc JEAN-GILLES"],
        abstract: "Présentation d'un cas de corps étranger bronchique chez l'enfant et sa prise en charge",
        date: new Date(2024, 6, 1).toISOString(),
        pageNumber: 14,
        tags: ["pédiatrie", "pneumologie", "cas clinique"],
        views: 95,
        citations: 2,
        downloads: 40,
        volume: "47"
      },
      {
        id: "4",
        title: "Glycation et les maladies",
        authors: ["Reynald ALTEMA"],
        abstract: "Étude approfondie sur le processus de glycation et son impact sur diverses pathologies",
        date: new Date(2024, 6, 1).toISOString(),
        pageNumber: 16,
        tags: ["biochimie", "pathologie"],
        views: 150,
        citations: 8,
        downloads: 65,
        volume: "47"
      },
      {
        id: "5",
        title: "Instabilité sociopolitique et prise en charge de la drépanocytose chez les enfants en Haïti",
        authors: ["Ronald ÉVEILLARD", "et al"],
        abstract: "Analyse de l'impact de l'instabilité sociopolitique sur la prise en charge des enfants drépanocytaires en Haïti",
        date: new Date(2024, 6, 1).toISOString(),
        pageNumber: 20,
        tags: ["pédiatrie", "santé publique", "drépanocytose"],
        views: 200,
        citations: 12,
        downloads: 88,
        volume: "47"
      }
    ]
  },
  {
    id: "2",
    volume: "46",
    date: new Date(2024, 3, 1).toISOString(),
    description: "Volume 46 de la revue INFOCHIR-RHCA",
    articleCount: 6,
    articles: [
      // Add mock articles for volume 46
    ]
  }
];

interface RhcaGridProps {
  viewMode?: "grid" | "table";
}

export const RhcaGrid = ({ viewMode = "grid" }: RhcaGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedVolume, setSelectedVolume] = useState<RhcaVolume | null>(null);

  const filteredVolumes = useMemo(() => {
    return mockVolumes.filter((volume) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        volume.volume.toLowerCase().includes(searchLower) ||
        volume.description?.toLowerCase().includes(searchLower) ||
        volume.articles.some(
          article =>
            article.title.toLowerCase().includes(searchLower) ||
            article.abstract.toLowerCase().includes(searchLower) ||
            article.authors.some(author => 
              author.toLowerCase().includes(searchLower)
            )
        )
      );
    });
  }, [searchTerm]);

  const sortVolumes = (volumes: RhcaVolume[], sortType: string) => {
    let sorted = [...volumes];
    switch (sortType) {
      case "latest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      default:
        break;
    }
    return sorted;
  };

  const sortedVolumes = sortVolumes(filteredVolumes, sortBy);

  if (selectedVolume) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedVolume(null)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux volumes
        </Button>
        <RhcaArticleList volume={selectedVolume} viewMode={viewMode} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={[
          { value: "latest", label: "Plus récents" },
        ]}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {sortedVolumes.map((volume) => (
          <VolumeCard
            key={volume.id}
            volume={volume}
            onClick={setSelectedVolume}
          />
        ))}
      </div>
    </div>
  );
};
