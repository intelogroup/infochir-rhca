
import { MainLayout } from "@/components/layouts/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { ArticleGrid } from "@/components/index-medicus/ArticleGrid";

import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SourceFilterType } from "@/components/index-medicus/SourceFilter";
import { SEO, collectionPageSchema } from "@/components/seo/SEO";

const IndexMedicus = () => {
  const [sourceFilter, setSourceFilter] = useState<SourceFilterType>('all');
  const [activeTab, setActiveTab] = useState('titres');

  const handleSourceFilterChange = (source: SourceFilterType) => {
    setSourceFilter(source);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset to show all articles when clicking on Titres tab
    if (tab === 'titres') {
      setSourceFilter('all');
    }
  };

  // Reset to all articles on page refresh/mount
  useEffect(() => {
    setSourceFilter('all');
    setActiveTab('titres');
  }, []);

  return (
    <MainLayout>
      <SEO
        title="Index Medicus | Base d'articles médicaux haïtiens"
        description="Recherchez dans l'Index Medicus haïtien : milliers d'articles médicaux et chirurgicaux indexés par auteur, thème et année."
        path="/index-medicus"
      jsonLd={collectionPageSchema("Index Medicus", "Base de données d'articles médicaux et chirurgicaux haïtiens.", "/index-medicus")}
      />
      <div className="min-h-screen bg-background">
        <div className="pt-[88px]">
          <PageHeader
            backLink="/"
            logoSrc="/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
            logoAlt="Index Medicus Logo"
            title="Index Medicus"
            description="Base de données bibliographique de la littérature médicale haïtienne."
            variant="brand"
          />
        </div>

        <div className="container max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col">


            <div className="order-1 mb-4 sm:mb-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-4 sm:mb-6">
                <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto overflow-x-auto scrollbar-hide bg-transparent">
                  <TabsTrigger 
                    value="titres" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap transition-colors"
                  >
                    Titres
                  </TabsTrigger>
                  <TabsTrigger 
                    value="auteurs" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap transition-colors"
                  >
                    Auteurs
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="titres" className="mt-4 sm:mt-6">
                  <div className="bg-white rounded-lg p-2 sm:p-4 lg:p-6 shadow-md border border-gray-100">
                    <Suspense fallback={<LoadingSpinner variant="primary" text="Chargement des articles..." />}>
                      <ArticleGrid 
                        viewMode="table"
                        sourceFilter={sourceFilter}
                        onSourceFilterChange={handleSourceFilterChange}
                        sortBy="title"
                      />
                    </Suspense>
                  </div>
                </TabsContent>
                
                <TabsContent value="auteurs" className="mt-4 sm:mt-6">
                  <div className="bg-white rounded-lg p-2 sm:p-4 lg:p-6 shadow-md border border-gray-100">
                    <Suspense fallback={<LoadingSpinner variant="primary" text="Chargement des articles..." />}>
                      <ArticleGrid 
                        viewMode="table"
                        sourceFilter={sourceFilter}
                        onSourceFilterChange={handleSourceFilterChange}
                        sortBy="author"
                      />
                    </Suspense>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="order-3 bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow mt-6 sm:mt-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <Info className="h-6 w-6 sm:h-8 sm:w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-2 sm:mb-4">
                    À propos de l'Index Medicus
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
                    L'Index Medicus est une base de données bibliographique qui recense la littérature médicale haïtienne. Elle permet aux professionnels de santé d'accéder facilement aux publications médicales locales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IndexMedicus;
