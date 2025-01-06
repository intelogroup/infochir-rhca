import { MainLayout } from "@/components/layouts/MainLayout";
import { ArticleGrid } from "@/components/index-medicus/ArticleGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoundersSection } from "@/components/home/FoundersSection";
import { motion } from "framer-motion";

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

          <Tabs defaultValue="articles" className="mb-6">
            <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
              <TabsTrigger 
                value="articles" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Articles
              </TabsTrigger>
              <TabsTrigger 
                value="titre" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Titre
              </TabsTrigger>
              <TabsTrigger 
                value="authors" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Auteurs
              </TabsTrigger>
              <TabsTrigger 
                value="institutions" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Institutions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="articles" className="mt-6">
              <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm">
                <ArticleGrid viewMode="table" />
              </div>
            </TabsContent>
            <TabsContent value="titre" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600">Liste des titres à venir...</p>
              </div>
            </TabsContent>
            <TabsContent value="authors" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600">Liste des auteurs à venir...</p>
              </div>
            </TabsContent>
            <TabsContent value="institutions" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600">Liste des institutions à venir...</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-12 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 shadow-md border border-gray-100"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 bg-gradient-to-r from-[#1E40AF] via-[#41b06e] to-[#41b06e] bg-clip-text text-transparent">
                  À propos de l'Index Medicus
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    L'Index Medicus est une base de données bibliographique qui recense la littérature médicale haïtienne. 
                    Elle permet aux professionnels de santé d'accéder facilement aux publications médicales locales.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gradient-to-br from-[#1E40AF]/5 to-transparent p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-primary mb-3">Mission</h3>
                      <p className="text-gray-600">
                        Faciliter l'accès à la littérature médicale haïtienne et promouvoir la recherche scientifique locale.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#41b06e]/5 to-transparent p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-primary mb-3">Vision</h3>
                      <p className="text-gray-600">
                        Devenir la référence principale pour la documentation médicale en Haïti.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FoundersSection />
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IndexMedicus;