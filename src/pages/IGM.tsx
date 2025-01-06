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
          <div className="space-y-4 sm:space-y-6">
            <Link to="/" className="inline-block">
              <Button variant="ghost" size="sm" className="gap-1.5 sm:gap-2 text-primary hover:text-primary-light">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                Retour
              </Button>
            </Link>

            <div className="text-center animate-fade-up space-y-4">
              <img 
                src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
                alt="IGM Logo"
                className="h-12 w-12 sm:h-16 sm:w-16 mx-auto object-contain"
              />
              <div className="space-y-2">
                <h1 className="text-xl sm:text-3xl font-bold text-primary">
                  Info Gazette Médicale
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                  Votre source d'information médicale de référence en Haïti.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
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
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                <IssuesGrid viewMode={viewMode} />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-4 order-first lg:order-none">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Soumission d'articles
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Nous accueillons les articles originaux, les revues systématiques, les cas cliniques et les lettres à l'éditeur.
                </p>
                <Button className="w-full bg-ocean hover:bg-ocean-hover">
                  Soumettre un manuscrit
                </Button>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Instructions aux auteurs
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Consultez nos directives détaillées pour la préparation et la soumission de votre manuscrit.
                </p>
                <Button variant="outline" className="w-full text-ocean hover:bg-ocean hover:text-white border-ocean">
                  Voir les directives
                </Button>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Comité éditorial
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs.
                </p>
                <Link to="/igm/editorial-committee" className="block">
                  <Button variant="outline" className="w-full text-ocean hover:bg-ocean hover:text-white border-ocean">
                    Découvrir l'équipe
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mt-8 bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                <Check className="h-5 w-5" />
                Notre Mission
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                L'Info Gazette Médicale (IGM) est une publication périodique dédiée à l'information médicale en Haïti. Notre mission est de fournir des informations actualisées et pertinentes sur les avancées médicales et les pratiques cliniques.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-primary">Objectifs</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
                    <li>Diffuser l'information médicale</li>
                    <li>Promouvoir la recherche locale</li>
                    <li>Améliorer les pratiques cliniques</li>
                    <li>Faciliter le partage des connaissances</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-primary">Impact</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
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