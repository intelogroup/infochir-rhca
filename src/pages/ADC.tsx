import { MainLayout } from "@/components/layouts/MainLayout";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { ADCMission } from "@/components/adc/ADCMission";
import { ADCSubmission } from "@/components/adc/ADCSubmission";
import { Routes, Route } from "react-router-dom";
import { AtlasCard } from "@/components/atlas/AtlasCard";
import { AtlasTableOfContents } from "@/components/atlas/AtlasTableOfContents";
import { introductionChapter } from "@/components/atlas/data/categories/introduction";
import { traumaChapters } from "@/components/atlas/data/categories/trauma";
import { specialtiesChapters } from "@/components/atlas/data/categories/specialties";
import { thoracicChapters } from "@/components/atlas/data/categories/thoracic";
import { digestiveChapters } from "@/components/atlas/data/categories/digestive";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const ADC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const allChapters = [
    introductionChapter,
    ...traumaChapters,
    ...specialtiesChapters,
    ...thoracicChapters,
    ...digestiveChapters,
  ];

  const filteredChapters = allChapters.filter(chapter => 
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <AtlasTableOfContents />
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
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredChapters.map((chapter) => (
                      <AtlasCard key={chapter.id} chapter={chapter} />
                    ))}
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