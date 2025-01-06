import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MainLayout } from "@/components/layouts/MainLayout";
import { RhcaArticleList } from "@/components/rhca/RhcaArticleList";
import { BackToTop } from "@/components/navigation/BackToTop";
import { mockArticles } from "@/components/rhca/data/mockArticles";

const RHCA = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              RHCA Publications
            </h1>
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value as "grid" | "table")}
              className="bg-white shadow-sm rounded-lg border border-gray-200"
            >
              <ToggleGroupItem value="grid" size="sm" className="px-3 py-2">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" size="sm" className="px-3 py-2">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <RhcaArticleList 
            articles={mockArticles} 
            viewMode={viewMode} 
          />
        </div>
      </div>
      <BackToTop />
    </MainLayout>
  );
};

export default RHCA;