import { MainLayout } from "@/components/layouts/MainLayout";
import { RhcaGrid } from "@/components/rhca/RhcaGrid";
import { BackToTop } from "@/components/navigation/BackToTop";

const RHCA = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
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