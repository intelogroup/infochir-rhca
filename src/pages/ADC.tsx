import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { Suspense, lazy } from "react";
import { useAtlasArticles } from "@/components/atlas/hooks/useAtlasArticles";
import { AtlasCard } from "@/components/atlas/AtlasCard";
import { AtlasTableOfContents } from "@/components/atlas/AtlasTableOfContents";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components
const ADCMission = lazy(() => import("@/components/adc/ADCMission").then(module => ({ default: module.ADCMission })));
const ADCSubmission = lazy(() => import("@/components/adc/ADCSubmission").then(module => ({ default: module.ADCSubmission })));

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-64 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[300px]" />
      ))}
    </div>
  </div>
);

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
                    <LoadingSkeleton />
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

                <Suspense fallback={<LoadingSkeleton />}>
                  <ADCMission />
                </Suspense>
                
                <Suspense fallback={<LoadingSkeleton />}>
                  <ADCSubmission />
                </Suspense>
              </>
            }
          />
        </Routes>
      </div>
    </MainLayout>
  );
};

export default ADC;