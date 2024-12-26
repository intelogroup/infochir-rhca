import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { DiagnosticGrid } from "@/components/diagnostic/DiagnosticGrid";

const ADC = () => {
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
            src="/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
            alt="Atlas ADC Logo"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Atlas de Diagnostic Chirurgical
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Une ressource visuelle complète pour le diagnostic chirurgical.
          </p>
        </div>

        <DiagnosticGrid />

        <div className="mt-16 max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-secondary mb-4">Notre Mission</h2>
            <p className="text-gray-600 mb-6">
              L'Atlas de Diagnostic Chirurgical est une ressource visuelle complète dédiée à l'avancement 
              de la pratique chirurgicale. Notre mission est de fournir une plateforme pour partager les 
              connaissances, les innovations et les meilleures pratiques dans le domaine du diagnostic chirurgical.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-secondary mb-4">
              Soumission d'articles
            </h2>
            <p className="text-gray-600 mb-6">
              Nous accueillons les articles originaux, les revues systématiques, les cas cliniques 
              et les lettres à l'éditeur. Notre processus de révision par les pairs garantit la 
              qualité et la pertinence de chaque publication.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-secondary">Soumettre un manuscrit</h3>
                <Button className="w-full">
                  Soumettre un article
                </Button>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-secondary">Instructions aux auteurs</h3>
                <p className="text-sm text-gray-600">
                  Consultez nos directives détaillées pour la préparation et la soumission de votre 
                  manuscrit. Nous fournissons des modèles et des conseils pour assurer une présentation 
                  optimale de vos travaux.
                </p>
                <Button variant="outline" className="w-full">
                  Voir les directives
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADC;