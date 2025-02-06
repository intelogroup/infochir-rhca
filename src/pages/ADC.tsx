
import { MainLayout } from "@/components/layouts/MainLayout";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { Suspense, lazy, useRef } from "react";
import { useAtlasArticles } from "@/components/atlas/hooks/useAtlasArticles";
import { AtlasCard } from "@/components/atlas/AtlasCard";
import { AtlasTableOfContents } from "@/components/atlas/AtlasTableOfContents";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useVirtualizer } from "@tanstack/react-virtual";

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

const VirtualizedAtlasGrid = ({ chapters }: { chapters: any[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const columnCount = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const rowCount = Math.ceil(chapters.length / columnCount);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
    overscan: 3,
  });

  return (
    <div
      ref={parentRef}
      className="h-[800px] overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {Array.from({ length: columnCount }).map((_, columnIndex) => {
                const chapterIndex = virtualRow.index * columnCount + columnIndex;
                const chapter = chapters[chapterIndex];
                
                if (!chapter) return null;
                
                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: columnIndex * 0.1 }}
                  >
                    <AtlasCard chapter={chapter} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ADC = () => {
  const { data: chapters, isLoading } = useAtlasArticles();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-[70px]">
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
            <VirtualizedAtlasGrid chapters={chapters} />
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
      </div>
    </MainLayout>
  );
};

export default ADC;
