
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { RHCAHeader } from "@/components/rhca/components/RHCAHeader";
import { RhcaContent } from "@/components/rhca/RhcaContent";
import { RHCAAdminPanel } from "@/components/rhca/admin/RHCAAdminPanel";
import { useSearchParams } from "react-router-dom";

const RHCA: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const isDebug = searchParams.get('debug') === 'true';

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50 pt-[50px]">
        <RHCAHeader />
        
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Admin panel section */}
          <RHCAAdminPanel isAdmin={isAdmin} isDebug={isDebug} />
          
          {/* Main content section */}
          <RhcaContent />
        </div>
      </div>
    </MainLayout>
  );
};

export default RHCA;
