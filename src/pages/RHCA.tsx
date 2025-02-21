
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { RhcaGrid } from "@/components/rhca/RhcaGrid";
import BackToTop from "@/components/navigation/BackToTop";
import { RHCAHeader } from "@/components/rhca/components/RHCAHeader";
import { RHCASidebar } from "@/components/rhca/components/RHCASidebar";
import { RenameFilesButton } from "@/components/rhca/RenameFilesButton";

const RHCA: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50 pt-[50px]">
        <RHCAHeader />
        
        <div className="container mx-auto px-4 py-8 md:py-12">
          <RenameFilesButton />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
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
