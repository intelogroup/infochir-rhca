import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { IssuesGrid } from "@/components/IssuesGrid";
import { AdminPanel } from "@/components/rhca/AdminPanel";
import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";

const RHCA = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    setIsAdmin(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary-light">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        <div className="text-center mb-12 animate-fade-up">
          <img 
            src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
            alt="RHCA Logo"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            La première revue scientifique dédiée à l'avancement de la chirurgie et de l'anesthésiologie en Haïti.
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
            {isAdmin ? (
              <AdminPanel />
            ) : (
              <IssuesGrid viewMode={viewMode} />
            )}
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                Soumission d'articles
              </h2>
              <p className="text-gray-600 mb-6">
                Nous accueillons les articles originaux, les revues systématiques, les cas cliniques et les lettres à l'éditeur. Notre processus de révision par les pairs garantit la qualité et la pertinence de chaque publication.
              </p>
              <Button className="w-full bg-secondary hover:bg-secondary-light">
                Soumettre un manuscrit
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                Instructions aux auteurs
              </h2>
              <p className="text-gray-600 mb-6">
                Consultez nos directives détaillées pour la préparation et la soumission de votre manuscrit. Nous fournissons des modèles et des conseils pour assurer une présentation optimale de vos travaux.
              </p>
              <Button variant="outline" className="w-full text-secondary hover:text-secondary-light">
                Voir les directives
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Notre Mission</h2>
          <p className="text-gray-600 mb-6">
            La RHCA est une publication scientifique biannuelle qui vise à promouvoir l'excellence en chirurgie et en anesthésiologie en Haïti. Notre mission est de fournir une plateforme pour partager les connaissances, les innovations et les meilleures pratiques dans le domaine médical.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="font-semibold text-secondary mb-2">Objectifs</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Promouvoir la recherche médicale locale</li>
                <li>Faciliter le partage des connaissances</li>
                <li>Améliorer les pratiques cliniques</li>
                <li>Encourager la collaboration internationale</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-secondary mb-2">Impact</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Plus de 200 articles publiés</li>
                <li>Collaboration avec 15 institutions</li>
                <li>Lectorat dans 25 pays</li>
                <li>Indexation dans des bases internationales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHCA;