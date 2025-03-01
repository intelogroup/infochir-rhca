
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { RhcaGrid } from "@/components/rhca/RhcaGrid";
import BackToTop from "@/components/navigation/BackToTop";
import { RHCAHeader } from "@/components/rhca/components/RHCAHeader";
import { RHCASidebar } from "@/components/rhca/components/RHCASidebar";
import { UploadPlaceholderCovers } from "@/components/rhca/utilities/uploadPlaceholderCovers";
import { useSearchParams } from "react-router-dom";

const RHCA: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50 pt-[50px]">
        <RHCAHeader />
        
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {isAdmin && (
                <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <UploadPlaceholderCovers />
                </div>
              )}
              <RhcaGrid />
            </div>
            
            <div className="lg:col-span-1">
              <RHCASidebar />
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </MainLayout>
  );
};

export default RHCA;
