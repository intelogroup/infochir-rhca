import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { ADCMission } from "@/components/adc/ADCMission";
import { ADCSubmission } from "@/components/adc/ADCSubmission";
import { useAtlasArticles } from "@/components/atlas/hooks/useAtlasArticles";
import { AtlasCard } from "@/components/atlas/AtlasCard";
import { AtlasTableOfContents } from "@/components/atlas/AtlasTableOfContents";
import { motion } from "framer-motion";

const ADC = () => {
  const { data: chapters, isLoading } = useAtlasArticles();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-[70px]">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ADCHeader />
                <div className="container mx-auto px-4 py-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Atlas de Diagnostic Chirurgical
                    </h2>
                    <AtlasTableOfContents />
                  </div>
                  
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />
                      ))}
                    </div>
                  ) : chapters && chapters.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {chapters.map((chapter) => (
                        <AtlasCard key={chapter.id} chapter={chapter} />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Aucun chapitre disponible pour le moment
                    </div>
                  )}
                </div>
                <ADCMission />
                <ADCSubmission />
              </>
            }
          />
        </Routes>
      </div>
    </MainLayout>
  );
};

export default ADC;