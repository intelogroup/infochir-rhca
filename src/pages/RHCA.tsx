import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List, BookOpen, Users, MessageCircle } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { RhcaGrid } from "@/components/rhca/RhcaGrid";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

const RHCA = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <MainLayout>
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <Link to="/" className="inline-block mb-6 sm:mb-8">
          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Retour
          </Button>
        </Link>

        <div className="text-center mb-8 sm:mb-12 animate-fade-up">
          <h1 className="text-2xl sm:text-4xl font-bold text-primary mb-3 sm:mb-4 px-2">
            INFOCHIR – RHCA : La Revue Haitienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
            La référence en chirurgie et anesthésiologie en Haïti
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2">
            <div className="mb-4 sm:mb-6 flex justify-end">
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "table")}>
                <ToggleGroupItem value="grid" size="sm" className="px-2 sm:px-3">
                  <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" size="sm" className="px-2 sm:px-3">
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <ErrorBoundary>
              <RhcaGrid viewMode={viewMode} />
            </ErrorBoundary>
          </div>
          
          <div className="space-y-4 sm:space-y-8">
            <ErrorBoundary>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  Soumission d'articles
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Nous accueillons les articles originaux, les revues systématiques, les cas cliniques et les lettres à l'éditeur.
                </p>
                <Button className="w-full bg-primary hover:bg-primary-light text-sm sm:text-base">
                  Soumettre un manuscrit
                </Button>
              </div>
            </ErrorBoundary>

            <ErrorBoundary>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  Instructions aux auteurs
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Consultez nos directives détaillées pour la préparation et la soumission de votre manuscrit.
                </p>
                <Button variant="outline" className="w-full text-primary hover:text-primary-light text-sm sm:text-base">
                  Voir les directives
                </Button>
              </div>
            </ErrorBoundary>

            <ErrorBoundary>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  Comité éditorial
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs.
                </p>
                <Link to="/rhca/editorial-committee">
                  <Button variant="outline" className="w-full text-primary hover:text-primary-light text-sm sm:text-base">
                    Découvrir l'équipe
                  </Button>
                </Link>
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RHCA;