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

const ADC = () => {
  const allChapters = [
    introductionChapter,
    ...traumaChapters,
    ...specialtiesChapters,
    ...thoracicChapters,
    ...digestiveChapters,
  ];

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
                  <AtlasTableOfContents />
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allChapters.map((chapter) => (
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