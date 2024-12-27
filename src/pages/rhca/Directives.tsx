import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            Guide pour les auteurs
          </h1>
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

        <Tabs defaultValue="rhca" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="rhca">RHCA</TabsTrigger>
            <TabsTrigger value="igm">IGM</TabsTrigger>
          </TabsList>

          <TabsContent value="rhca" className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-secondary mb-6">
                Publication dans la Revue Haïtienne de Chirurgie et d'Anesthésie
              </h2>
              <p className="text-gray-600 mb-6">
                La RHCA d'info CHIR reçoit l'envoi d'articles à caractère clinique, expérimental, culturel, historique pertinents avec des thèmes chirurgicaux et anesthésiologiques.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-secondary mb-4">Préparation du manuscrit</h3>
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

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-secondary mb-4">Structure du manuscrit</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Abstract (max 250 mots)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>3-5 mots clés</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Introduction, Méthodes, Résultats, Discussion, Conclusion</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-secondary mb-4">Check-list de soumission</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Lettre de soumission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Déclaration de l'auteur</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>Références complètes des auteurs</span>
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
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="igm" className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Publication dans l'Info Gazette Médicale
              </h2>
              <p className="text-gray-600 mb-6">
                L'IGM d'info CHIR reçoit l'envoi d'articles à caractère clinique, expérimental, culturel, social et historique pertinents avec des thèmes de santé publique.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-primary mb-4">Rubriques de l'IGM</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Lu pour vous</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Santé publique</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Actualités Intra Hospitalières</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Informations socio culturelles</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>Petites annonces</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-primary mb-4">Notes importantes</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <span>Règlementation sujette à modification</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <span>IGM n'est pas une tribune politique ni de propagande individuelle ou de groupe</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <span>Toute information est sujette à vérification</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

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