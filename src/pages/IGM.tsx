import { Button } from "@/components/ui/button";
import { LayoutGrid, List, BookOpen, MessageCircle, Users, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MainLayout } from "@/components/layouts/MainLayout";
import { IssuesGrid } from "@/components/igm/IssuesGrid";
import { BackToTop } from "@/components/navigation/BackToTop";
import { YearNavigation } from "@/components/igm/components/YearNavigation";
import { IGMHeader } from "@/components/igm/components/IGMHeader";
import { IGMSidebar } from "@/components/igm/components/IGMSidebar";
import { motion } from "framer-motion";

const IGM = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const availableYears = [2020, 2021, 2022, 2023, 2024];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F1F0FB] pt-[15px]">
        {/* Header Section */}
        <IGMHeader />

        {/* Main Content */}
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[1fr,350px] lg:gap-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <YearNavigation
                  currentYear={currentYear}
                  availableYears={availableYears}
                  onYearChange={setCurrentYear}
                  className="w-full sm:w-auto"
                />
                
                <ToggleGroup 
                  type="single" 
                  value={viewMode} 
                  onValueChange={(value) => value && setViewMode(value as "grid" | "table")}
                  className="self-end sm:self-auto bg-white shadow-sm rounded-lg border border-gray-100"
                >
                  <ToggleGroupItem value="grid" size="sm" className="px-3 py-2">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="table" size="sm" className="px-3 py-2">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100"
              >
                <IssuesGrid viewMode={viewMode} />
              </motion.div>
            </div>
            
            {/* Sidebar */}
            <IGMSidebar />
          </div>
        </div>
      </div>
      <BackToTop />
    </MainLayout>
  );
};

export default IGM;