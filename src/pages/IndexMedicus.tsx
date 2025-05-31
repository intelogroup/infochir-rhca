
import { MainLayout } from "@/components/layouts/MainLayout";
import { ArticleGrid } from "@/components/index-medicus/ArticleGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SourceFilterType } from "@/components/index-medicus/SourceFilter";

const IndexMedicus = () => {
  const [sourceFilter, setSourceFilter] = useState<SourceFilterType>('all');

  const handleSourceFilterChange = (source: SourceFilterType) => {
    setSourceFilter(source);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
        <div className="container max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8 pt-[100px] sm:pt-[120px]">
          <div className="mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                Retour
              </Button>
            </Link>
          </div>

          <div className="flex flex-col">
            <div className="order-2 mb-6 sm:mb-8 lg:mb-12 animate-fade-up">
              <div className="inline-flex rounded-full p-1 sm:p-2 mb-4 sm:mb-6">
                <div className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 lg:h-24 lg:w-24 bg-white rounded-full p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <img 
                    src="/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
                    alt="Index Medicus Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
                Index Medicus
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mb-4 sm:mb-6 px-2 font-medium">
                Base de données bibliographique de la littérature médicale haïtienne.
              </p>
            </div>

            <div className="order-1 mb-4 sm:mb-6">
              <Tabs defaultValue="all-articles" className="mb-4 sm:mb-6">
                <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto overflow-x-auto scrollbar-hide bg-transparent">
                  <TabsTrigger 
                    value="all-articles" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap transition-colors"
                  >
                    Tous les Articles
                  </TabsTrigger>
                  <TabsTrigger 
                    value="titre" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap transition-colors"
                  >
                    Titre
                  </TabsTrigger>
                  <TabsTrigger 
                    value="authors" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap transition-colors"
                  >
                    Auteurs
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all-articles" className="mt-4 sm:mt-6">
                  <div className="bg-white rounded-lg p-2 sm:p-4 lg:p-6 shadow-md border border-gray-100">
                    <Suspense fallback={<LoadingSpinner variant="primary" text="Chargement des articles..." />}>
                      <ArticleGrid 
                        viewMode="table" 
                        sourceFilter={sourceFilter}
                        onSourceFilterChange={handleSourceFilterChange}
                      />
                    </Suspense>
                  </div>
                </TabsContent>
                
                <TabsContent value="titre" className="mt-4 sm:mt-6">
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md border border-gray-100">
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                      <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-primary/20 mb-4" />
                      <p className="text-gray-600 text-base sm:text-lg font-medium">Liste des titres à venir...</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="authors" className="mt-4 sm:mt-6">
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md border border-gray-100">
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                      <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-primary/20 mb-4" />
                      <p className="text-gray-600 text-base sm:text-lg font-medium">Liste des auteurs à venir...</p>
                    </div>
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
