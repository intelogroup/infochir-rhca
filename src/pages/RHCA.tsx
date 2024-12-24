import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { IssuesGrid } from "@/components/IssuesGrid";

const RHCA = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
            alt="RHCA Logo"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Publiez vos articles scientifiques et contribuez à l'avancement de la recherche médicale en Haïti.
          </p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <IssuesGrid />
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Soumission d'articles
              </h2>
              <p className="text-gray-600 mb-6">
                Nous accueillons les articles originaux, les revues systématiques, les cas cliniques et les lettres à l'éditeur.
              </p>
              <Button className="w-full">
                Soumettre un manuscrit
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Instructions aux auteurs
              </h2>
              <p className="text-gray-600 mb-6">
                Consultez nos directives détaillées pour la préparation et la soumission de votre manuscrit.
              </p>
              <Button variant="outline" className="w-full">
                Voir les directives
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHCA;