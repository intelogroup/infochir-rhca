import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { VolumeCard } from "./VolumeCard";
import type { RhcaVolume } from "./types";

const mockVolumes: RhcaVolume[] = [
  {
    id: "1",
    volume: "INFOCHIR/RHCA Volume 7 Numéro 47",
    date: new Date(2024, 0, 1).toISOString(),
    description: "Volume 47 de la revue INFOCHIR-RHCA",
    articleCount: 8,
    downloadCount: 325,
    shareCount: 156,
    articles: [
      {
        id: "1",
        title: "ÉDITORIAL",
        authors: ["Comité éditorial"],
        abstract: "Éditorial du numéro 47 de la revue INFOCHIR-RHCA",
        date: new Date(2024, 0, 1).toISOString(),
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
        date: new Date(2024, 0, 1).toISOString(),
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
        date: new Date(2024, 0, 1).toISOString(),
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
        date: new Date(2024, 0, 1).toISOString(),
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
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 20,
        tags: ["pédiatrie", "santé publique", "drépanocytose"],
        views: 200,
        citations: 12,
        downloads: 88,
        volume: "47"
      },
      {
        id: "6",
        title: "Les défis de la chirurgie pédiatrique en Haïti",
        authors: ["Marie-Carmelle PAUL", "Jean-Robert PIERRE"],
        abstract: "Analyse des défis et opportunités dans la pratique de la chirurgie pédiatrique en Haïti",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 25,
        tags: ["chirurgie pédiatrique", "santé publique"],
        views: 175,
        citations: 10,
        downloads: 70,
        volume: "47"
      },
      {
        id: "7",
        title: "Actualités en anesthésiologie",
        authors: ["Pierre LOUIS"],
        abstract: "Revue des dernières avancées en anesthésiologie et leur application dans le contexte haïtien",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 30,
        tags: ["anesthésiologie", "pratique clinique"],
        views: 160,
        citations: 7,
        downloads: 55,
        volume: "47"
      },
      {
        id: "8",
        title: "Recommandations pour la prise en charge des urgences chirurgicales",
        authors: ["Comité scientifique INFOCHIR-RHCA"],
        abstract: "Guide pratique pour la gestion des urgences chirurgicales dans les hôpitaux haïtiens",
        date: new Date(2024, 0, 1).toISOString(),
        pageNumber: 35,
        tags: ["urgences", "chirurgie", "protocoles"],
        views: 250,
        citations: 15,
        downloads: 95,
        volume: "47"
      }
    ]
  },
  {
    id: "2",
    volume: "INFOCHIR/RHCA Volume 7 Numéro 46",
    date: new Date(2023, 9, 1).toISOString(),
    description: "Volume 46 de la revue INFOCHIR-RHCA",
    articleCount: 6,
    downloadCount: 280,
    shareCount: 120,
    articles: [
      {
        id: "6",
        title: "Prise en charge des traumatismes crâniens en Haïti",
        authors: ["Marie DURAND", "Jean PIERRE"],
        abstract: "Étude sur les protocoles de prise en charge des traumatismes crâniens dans les hôpitaux haïtiens",
        date: new Date(2024, 3, 1).toISOString(),
        pageNumber: 4,
        tags: ["neurochirurgie", "traumatologie"],
        views: 180,
        citations: 15,
        downloads: 75,
        volume: "46"
      },
      {
        id: "7",
        title: "Innovations en chirurgie laparoscopique",
        authors: ["Paul MARTIN"],
        abstract: "Revue des dernières avancées en chirurgie mini-invasive",
        date: new Date(2024, 3, 1).toISOString(),
        pageNumber: 12,
        tags: ["chirurgie", "laparoscopie"],
        views: 220,
        citations: 18,
        downloads: 95,
        volume: "46"
      }
    ]
  }
];

interface RhcaGridProps {
  viewMode?: "grid" | "table";
}

export const RhcaGrid = ({ viewMode = "grid" }: RhcaGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

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
          />
        ))}
      </div>
    </div>
  );
};
