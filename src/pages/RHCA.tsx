import { MainLayout } from "@/components/layouts/MainLayout";
import { RhcaGrid } from "@/components/rhca/RhcaGrid";
import { BackToTop } from "@/components/navigation/BackToTop";

const RHCA = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              RHCA Publications
            </h1>
          </div>
          
          <RhcaGrid />
        </div>
      </div>
      <BackToTop />
    </MainLayout>
  );
};

export default RHCA;