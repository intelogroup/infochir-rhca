import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Directives = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/rhca" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary-light">
            <ArrowLeft className="h-4 w-4" />
            Retour à RHCA
          </Button>
        </Link>

        <div className="text-center mb-12 animate-fade-up">
          <FileText className="h-16 w-16 mx-auto mb-6 text-secondary" />
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Directives aux Auteurs
          </h1>
          <p className="text-xl text-gray-600">
            Guide complet pour la soumission d'articles à la Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Types d'Articles Acceptés</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Articles Originaux</h3>
                    <p className="text-gray-600 text-sm">Maximum 4000 mots, 6 figures/tableaux</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Cas Cliniques</h3>
                    <p className="text-gray-600 text-sm">Maximum 2000 mots, 4 figures/tableaux</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Revues Systématiques</h3>
                    <p className="text-gray-600 text-sm">Maximum 6000 mots, 8 figures/tableaux</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Lettres à l'Éditeur</h3>
                    <p className="text-gray-600 text-sm">Maximum 1000 mots, 1 figure/tableau</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Format du Manuscrit</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Page de Titre</h3>
                  <p className="text-gray-600">
                    Titre complet, auteurs et affiliations, auteur correspondant, mots-clés (3-5)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Résumé Structuré</h3>
                  <p className="text-gray-600">
                    Introduction, Méthodes, Résultats, Conclusion (250 mots maximum)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Corps du Texte</h3>
                  <p className="text-gray-600">
                    Introduction, Matériels et Méthodes, Résultats, Discussion, Conclusion
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Exigences Techniques</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Format de Fichier</h3>
                  <p className="text-gray-600">
                    Document Word (.doc ou .docx), double interligne, marges de 2.5 cm
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Images et Figures</h3>
                  <p className="text-gray-600">
                    Format JPEG ou PNG, résolution minimale 300 dpi, légendes requises
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Références</h3>
                  <p className="text-gray-600">
                    Style Vancouver, numérotées dans l'ordre d'apparition
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-center pt-8">
            <Button className="bg-secondary hover:bg-secondary-light">
              Soumettre un Manuscrit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directives;