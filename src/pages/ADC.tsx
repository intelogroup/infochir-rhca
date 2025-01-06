import { MainLayout } from "@/components/layouts/MainLayout";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { ADCMission } from "@/components/adc/ADCMission";
import { ADCSubmission } from "@/components/adc/ADCSubmission";
import { Routes, Route } from "react-router-dom";
import { AtlasCard } from "@/components/atlas/AtlasCard";
import { AtlasTableOfContents } from "@/components/atlas/AtlasTableOfContents";
import { atlasChapters } from "@/components/atlas/data/atlasChapters";
import { atlasCategories } from "@/components/atlas/data/atlasCategories";
import { Input } from "@/components/ui/input";
import { Search, SortAsc } from "lucide-react";
import { useState, useMemo } from "react";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ADC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"latest" | "title" | "category">("latest");
  
  const filteredAndSortedChapters = useMemo(() => {
    let filtered = atlasChapters;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(chapter => 
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(chapter => {
        const category = atlasCategories.find(cat => 
          cat.chapters.includes(chapter.id)
        );
        return category?.id === selectedCategory;
      });
    }

    // Sort chapters
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "category":
          const catA = atlasCategories.find(cat => cat.chapters.includes(a.id))?.title || "";
          const catB = atlasCategories.find(cat => cat.chapters.includes(b.id))?.title || "";
          return catA.localeCompare(catB);
        case "latest":
        default:
          if (!a.lastUpdate || !b.lastUpdate) return 0;
          return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      }
    });
  }, [searchQuery, selectedCategory, sortBy, atlasChapters]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-[50px]">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ADCHeader />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <Breadcrumbs
                    items={[
                      { label: "Atlas du Chirurgien", href: "/adc" },
                      { label: selectedCategory === "all" ? "Tous les chapitres" : 
                        atlasCategories.find(cat => cat.id === selectedCategory)?.title || "" }
                    ]}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6">
                    <div className="flex flex-wrap gap-4 items-center">
                      <AtlasTableOfContents />
                      
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {atlasCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={sortBy}
                        onValueChange={(value) => setSortBy(value as typeof sortBy)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">Plus récents</SelectItem>
                          <SelectItem value="title">Titre</SelectItem>
                          <SelectItem value="category">Catégorie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative w-full sm:w-[300px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Rechercher dans l'Atlas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    {selectedCategory !== "all" && (
                      <h2 className="text-xl font-semibold mb-4">
                        {atlasCategories.find(cat => cat.id === selectedCategory)?.title}
                      </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredAndSortedChapters.map((chapter) => (
                        <AtlasCard 
                          key={chapter.id} 
                          chapter={chapter}
                          category={atlasCategories.find(cat => 
                            cat.chapters.includes(chapter.id)
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <ADCMission />
                <ADCSubmission />
              </>
            }
          />
          <Route path="/chapters/:id" element={<div>Chapter Detail View</div>} />
        </Routes>
      </div>
    </MainLayout>
  );
};

export default ADC;