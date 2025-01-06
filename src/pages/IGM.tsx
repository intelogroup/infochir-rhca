import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List, BookOpen, Users, MessageCircle, Check } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { IssuesGrid } from "@/components/igm/IssuesGrid";
import { BackToTop } from "@/components/navigation/BackToTop";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { YearNavigation } from "@/components/igm/components/YearNavigation";

const IGM = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const availableYears = [2020, 2021, 2022, 2023, 2024];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F1F0FB]">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8 pt-16 sm:pt-20">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <Breadcrumbs
              items={[
                { label: "IGM", href: "/igm" },
                { label: "Publications" },
              ]}
            />
          </div>

          {/* Header Section */}
          <div className="space-y-6 sm:space-y-8">
            <Link to="/" className="inline-block">
              <Button variant="ghost" size="sm" className="gap-1.5 sm:gap-2 text-primary hover:text-primary-light">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                Retour
              </Button>
            </Link>

            <div className="text-center animate-fade-up space-y-4 sm:space-y-6">
              <img 
                src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
                alt="IGM Logo"
                className="h-12 w-12 sm:h-16 sm:w-16 lg:h-24 lg:w-24 mx-auto object-contain"
              />
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold text-primary">
                  Info Gazette Médicale
                </h1>
                <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">
                  Votre source d'information médicale de référence en Haïti.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8 sm:mt-12 grid lg:grid-cols-[1fr,400px] gap-4 sm:gap-6 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <YearNavigation
                  currentYear={currentYear}
                  availableYears={availableYears}
                  onYearChange={setCurrentYear}
                />
                
                <ToggleGroup 
                  type="single" 
                  value={viewMode} 
                  onValueChange={(value) => value && setViewMode(value as "grid" | "table")}
                  className="bg-white shadow-sm rounded-lg border border-gray-100"
                >
                  <ToggleGroupItem value="grid" size="sm" className="px-2 sm:px-3 py-1.5 sm:py-2">
                    <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="table" size="sm" className="px-2 sm:px-3 py-1.5 sm:py-2">
                    <List className="h-3 w-3 sm:h-4 sm:w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                <IssuesGrid viewMode={viewMode} />
              </div>
            </div>
            
            {/* Sidebar - Now with better mobile responsiveness */}
            <div className="space-y-4 sm:space-y-6 order-last lg:order-none">
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Soumission d'articles
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Nous accueillons les articles originaux, les revues systématiques, les cas cliniques et les lettres à l'éditeur.
                </p>
                <Button className="w-full bg-ocean hover:bg-ocean-hover text-sm sm:text-base py-2 sm:py-2.5">
                  Soumettre un manuscrit
                </Button>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Instructions aux auteurs
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Consultez nos directives détaillées pour la préparation et la soumission de votre manuscrit.
                </p>
                <Button variant="outline" className="w-full text-ocean hover:bg-ocean hover:text-white border-ocean text-sm sm:text-base py-2 sm:py-2.5">
                  Voir les directives
                </Button>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Comité éditorial
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs.
                </p>
                <Link to="/igm/editorial-committee" className="block">
                  <Button variant="outline" className="w-full text-ocean hover:bg-ocean hover:text-white border-ocean text-sm sm:text-base py-2 sm:py-2.5">
                    Découvrir l'équipe
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mission Section - Now with better spacing and responsive text */}
          <div className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-primary flex items-center gap-2">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                Notre Mission
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                L'Info Gazette Médicale (IGM) est une publication périodique dédiée à l'information médicale en Haïti. Notre mission est de fournir des informations actualisées et pertinentes sur les avancées médicales et les pratiques cliniques.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-base sm:text-lg text-primary">Objectifs</h3>
                  <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1.5 sm:space-y-2">
                    <li>Diffuser l'information médicale</li>
                    <li>Promouvoir la recherche locale</li>
                    <li>Améliorer les pratiques cliniques</li>
                    <li>Faciliter le partage des connaissances</li>
                  </ul>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-base sm:text-lg text-primary">Impact</h3>
                  <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1.5 sm:space-y-2">
                    <li>Publication mensuelle</li>
                    <li>Réseau national de contributeurs</li>
                    <li>Actualités médicales vérifiées</li>
                    <li>Formation continue</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </MainLayout>
  );
};

export default IGM;
