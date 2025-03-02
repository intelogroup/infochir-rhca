
import { MainLayout } from "@/components/layouts/MainLayout";
import { ArticleGrid } from "@/components/index-medicus/ArticleGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const IndexMedicus = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
        <div className="container max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8 pt-[120px]">
          <div className="mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
                <ArrowLeft className="h-5 w-5" />
                Retour
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-up">
            <div className="bg-gradient-to-r from-primary to-secondary inline-flex rounded-full p-2 mb-6">
              <img 
                src="/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
                alt="Index Medicus Logo"
                className="h-12 w-12 sm:h-16 sm:w-16 lg:h-24 lg:w-24 mx-auto mb-2 sm:mb-4 object-contain bg-white rounded-full p-1 shadow-md"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Index Medicus
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-4 sm:mb-8 px-2 font-medium">
              Base de données bibliographique de la littérature médicale haïtienne.
            </p>
          </div>

          <Tabs defaultValue="articles" className="mb-6 sm:mb-8">
            <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto overflow-x-auto scrollbar-hide bg-transparent">
              <TabsTrigger 
                value="articles" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium px-4 sm:px-6 py-3 text-sm sm:text-base whitespace-nowrap transition-colors"
              >
                Articles
              </TabsTrigger>
              <TabsTrigger 
                value="titre" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium px-4 sm:px-6 py-3 text-sm sm:text-base whitespace-nowrap transition-colors"
              >
                Titre
              </TabsTrigger>
              <TabsTrigger 
                value="authors" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium px-4 sm:px-6 py-3 text-sm sm:text-base whitespace-nowrap transition-colors"
              >
                Auteurs
              </TabsTrigger>
              <TabsTrigger 
                value="institutions" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-medium px-4 sm:px-6 py-3 text-sm sm:text-base whitespace-nowrap transition-colors"
              >
                Institutions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles" className="mt-6">
              <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-md border border-gray-100">
                <Suspense fallback={<LoadingSpinner variant="medical" text="Chargement des articles..." />}>
                  <ArticleGrid viewMode="table" />
                </Suspense>
              </div>
            </TabsContent>
            <TabsContent value="titre" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <div className="flex flex-col items-center justify-center py-8">
                  <BookOpen className="h-12 w-12 text-primary/20 mb-4" />
                  <p className="text-gray-600 text-lg font-medium">Liste des titres à venir...</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="authors" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <div className="flex flex-col items-center justify-center py-8">
                  <BookOpen className="h-12 w-12 text-primary/20 mb-4" />
                  <p className="text-gray-600 text-lg font-medium">Liste des auteurs à venir...</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="institutions" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <div className="flex flex-col items-center justify-center py-8">
                  <BookOpen className="h-12 w-12 text-primary/20 mb-4" />
                  <p className="text-gray-600 text-lg font-medium">Liste des institutions à venir...</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow mt-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
            
            <div className="flex items-start gap-4">
              <Info className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4">
                  À propos de l'Index Medicus
                </h2>
                <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
                  L'Index Medicus est une base de données bibliographique qui recense la littérature médicale haïtienne. Elle permet aux professionnels de santé d'accéder facilement aux publications médicales locales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IndexMedicus;
