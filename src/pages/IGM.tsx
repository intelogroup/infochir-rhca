import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { IssuesGrid } from "@/components/IssuesGrid";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";

const IGM = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        <div className="text-center mb-12 animate-fade-up">
          <img 
            src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
            alt="IGM Logo"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-primary mb-4">
            Info Gazette Médicale
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Votre source d'information médicale de référence en Haïti.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <div className="mb-6 flex justify-end">
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "table")}>
                <ToggleGroupItem value="grid" size="sm" className="px-3">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" size="sm" className="px-3">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <IssuesGrid viewMode={viewMode} />
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Soumission d'articles
              </h2>
              <p className="text-gray-600 mb-6">
                Nous accueillons les articles originaux, les revues systématiques, les cas cliniques et les lettres à l'éditeur. Notre processus de révision par les pairs garantit la qualité et la pertinence de chaque publication.
              </p>
              <Button className="w-full bg-primary hover:bg-primary-light">
                Soumettre un manuscrit
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Instructions aux auteurs
              </h2>
              <p className="text-gray-600 mb-6">
                Consultez nos directives détaillées pour la préparation et la soumission de votre manuscrit. Nous fournissons des modèles et des conseils pour assurer une présentation optimale de vos travaux.
              </p>
              <Button variant="outline" className="w-full text-primary hover:text-primary-light">
                Voir les directives
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-primary mb-4">Notre Mission</h2>
          <p className="text-gray-600 mb-6">
            L'Info Gazette Médicale (IGM) est une publication périodique dédiée à l'information médicale en Haïti. Notre mission est de fournir des informations actualisées et pertinentes sur les avancées médicales et les pratiques cliniques.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="font-semibold text-primary mb-2">Objectifs</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Diffuser l'information médicale</li>
                <li>Promouvoir la recherche locale</li>
                <li>Améliorer les pratiques cliniques</li>
                <li>Faciliter le partage des connaissances</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Impact</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
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
  );
};

export default IGM;