import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Directives = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/rhca" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary-light">
            <ArrowLeft className="h-4 w-4" />
            Retour à RHCA
          </Button>
        </Link>

        <div className="text-center mb-12 animate-fade-up">
          <FileText className="h-16 w-16 mx-auto mb-6 text-secondary" />
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Guide pour les auteurs RHCA
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            La RHCA d'info CHIR reçoit l'envoi d'articles à caractère clinique, expérimental, culturel, historique pertinents avec des thèmes chirurgicaux et anesthésiologiques.
          </p>
          <div className="flex items-center justify-center gap-6 text-gray-600 mt-4">
            <a href="mailto:infochir@gmail.com" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Mail className="h-4 w-4" />
              infochir@gmail.com
            </a>
            <a href="tel:+50947355350" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Phone className="h-4 w-4" />
              +509 47355350
            </a>
          </div>
          <p className="text-gray-600 mt-4">
            30 Rue Camille Léon, Port-au-Prince, HAITI
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-secondary mb-6">
              Préparation du manuscrit
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Format papier 29x21 cm, marges de 2.5 cm</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Police Times New Roman, taille 12, interligne double</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Pages numérotées en haut à droite</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-secondary mb-6">
              Structure du manuscrit
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Éléments essentiels</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Abstract (max 250 mots)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>3-5 mots clés (Index Medicus)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Introduction, Matériel et méthodes, Résultats, Discussion, Conclusion</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Composantes du titre</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Titre concis mais informatif</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Nom et prénom des auteurs avec degré académique</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Département ou Institution</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-secondary mb-6">
              Éléments complémentaires
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Tables et figures</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Tables numérotées avec titre explicatif</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Figures numérotées et citées dans le texte</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Légendes clairement indiquées</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Références</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Style Vancouver</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Numérotées dans l'ordre de citation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Accessibles et vérifiables</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Check-list de soumission</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Lettre de soumission à Info CHIR</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Déclaration de l'auteur (pas de conflit d'intérêt)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Références complètes des auteurs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Approbation éthique (si nécessaire)</span>
                </li>
              </ul>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Abstract et mots clés</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Tables et illustrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Autorisations nécessaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Copies du texte (format papier et/ou numérique)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-secondary mb-4">Notes importantes</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>La revue des manuscrits et leur publication est gratuite jusqu'à nouvelle disposition</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>Les documents peuvent être soumis sur support papier, dans une puce ou par Internet (préférable)</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>Règlementation sujette à modification</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button className="bg-secondary hover:bg-secondary-light">
            Soumettre un manuscrit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Directives;