import { MainLayout } from "@/components/layouts/MainLayout";
import { ArticleGrid } from "@/components/index-medicus/ArticleGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IndexMedicus = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F1F0FB]">
        <div className="container max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-4 lg:py-8 pt-20">
          <div className="flex items-center mb-4 sm:mb-6">
            <Link to="/" className="inline-block">
              <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                Retour
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8 sm:mb-12 animate-fade-up">
            <img 
              src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
              alt="Index Medicus Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 mx-auto mb-4 sm:mb-6 object-contain"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
              Index Medicus
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
              Base de données bibliographique de la littérature médicale haïtienne.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,400px] gap-4 sm:gap-6 lg:gap-8">
            <div>
              <Tabs defaultValue="articles" className="mb-6">
                <TabsList>
                  <TabsTrigger value="articles">Articles</TabsTrigger>
                  <TabsTrigger value="authors">Auteurs</TabsTrigger>
                  <TabsTrigger value="institutions">Institutions</TabsTrigger>
                </TabsList>
                <TabsContent value="articles">
                  <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm">
                    <ArticleGrid viewMode="table" />
                  </div>
                </TabsContent>
                <TabsContent value="authors">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <p className="text-gray-600">Liste des auteurs à venir...</p>
                  </div>
                </TabsContent>
                <TabsContent value="institutions">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <p className="text-gray-600">Liste des institutions à venir...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6 content-start">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary mb-3 sm:mb-4">
                  À propos de l'Index Medicus
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
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