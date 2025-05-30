
import { MainLayout } from "@/components/layouts/MainLayout";
import { DirectivesHeader } from "@/components/directives/DirectivesHeader";
import { DirectiveSection, ChecklistItem } from "@/components/directives/DirectiveSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, Newspaper, Users, Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Directives = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DirectivesHeader 
          title="Directives pour les auteurs"
          description="Guide complet pour soumettre vos manuscrits aux publications d'Info CHIR. Découvrez les directives générales et les exigences spécifiques pour chaque publication."
          backLink="/"
          backText="Retour à l'accueil"
        />

        <div className="space-y-8">
          {/* Publications Overview */}
          <DirectiveSection title="Nos publications">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-secondary" />
                    <div>
                      <CardTitle className="text-lg">RHCA</CardTitle>
                      <CardDescription>Revue Haïtienne de Chirurgie et d'Anesthésiologie</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Articles cliniques, expérimentaux et historiques en chirurgie et anesthésiologie.
                  </p>
                  <Link to="/rhca/directives">
                    <Button variant="outline" size="sm" className="w-full">
                      Voir les directives RHCA
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Newspaper className="h-8 w-8 text-secondary" />
                    <div>
                      <CardTitle className="text-lg">IGM</CardTitle>
                      <CardDescription>Info Gazette Médicale</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Actualités médicales, santé publique et informations socio-culturelles.
                  </p>
                  <Link to="/igm/directives">
                    <Button variant="outline" size="sm" className="w-full">
                      Voir les directives IGM
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-secondary" />
                    <div>
                      <CardTitle className="text-lg">Atlas ADC</CardTitle>
                      <CardDescription>Atlas de Diagnostic Chirurgical</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Documentation illustrée et guides de diagnostic chirurgical.
                  </p>
                  <Link to="/adc">
                    <Button variant="outline" size="sm" className="w-full">
                      Découvrir Atlas ADC
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </DirectiveSection>

          {/* General Guidelines */}
          <DirectiveSection title="Directives générales de soumission">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Processus de soumission</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Soumission par email à infochir@gmail.com" />
                  <ChecklistItem text="Lettre de soumission requise" />
                  <ChecklistItem text="Déclaration de l'auteur (absence de conflit d'intérêt)" />
                  <ChecklistItem text="Manuscrit en format Word ou PDF" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Éthique et authorship</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Respect des principes éthiques de la recherche" />
                  <ChecklistItem text="Consentement éclairé des patients (si applicable)" />
                  <ChecklistItem text="Approbation du comité d'éthique (si nécessaire)" />
                  <ChecklistItem text="Originalité du travail garantie" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          {/* Manuscript Preparation */}
          <DirectiveSection title="Préparation du manuscrit">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Format standard</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Police Times New Roman, taille 12" />
                  <ChecklistItem text="Interligne double" />
                  <ChecklistItem text="Marges de 2.5 cm" />
                  <ChecklistItem text="Pages numérotées" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Structure recommandée</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Titre concis et informatif" />
                  <ChecklistItem text="Résumé (Abstract) et mots-clés" />
                  <ChecklistItem text="Introduction, Méthodes, Résultats, Discussion" />
                  <ChecklistItem text="Références bibliographiques (style Vancouver)" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          {/* Review Process */}
          <DirectiveSection title="Processus d'évaluation">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Étapes d'évaluation</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Accusé de réception dans les 48h" />
                  <ChecklistItem text="Évaluation préliminaire par l'éditeur" />
                  <ChecklistItem text="Révision par les pairs (peer review)" />
                  <ChecklistItem text="Décision finale et notification" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Délais de traitement</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Première réponse: 2-4 semaines" />
                  <ChecklistItem text="Révision complète: 6-8 semaines" />
                  <ChecklistItem text="Publication: 8-12 semaines après acceptation" />
                  <ChecklistItem text="Accès gratuit en ligne" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          {/* Contact Information */}
          <DirectiveSection title="Contact et support" icon={<Users className="h-6 w-6 text-secondary" />}>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-secondary mb-4">Informations de contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-medium">Email principal</p>
                        <a href="mailto:infochir@gmail.com" className="text-secondary hover:underline">
                          infochir@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <a href="tel:+50947355350" className="text-secondary hover:underline">
                          +509 47355350
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary mb-4">Adresse</h3>
                  <p className="text-gray-600">
                    30 Rue Camille Léon<br />
                    Port-au-Prince, HAITI
                  </p>
                  <div className="mt-4">
                    <h4 className="font-medium text-secondary mb-2">Heures de bureau</h4>
                    <p className="text-gray-600 text-sm">
                      Lundi - Vendredi: 8h00 - 17h00<br />
                      Réponse par email sous 24-48h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DirectiveSection>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/submission">
              <Button className="bg-secondary hover:bg-secondary-light w-full sm:w-auto">
                Soumettre un manuscrit
              </Button>
            </Link>
            <Link to="/editorial">
              <Button variant="outline" className="w-full sm:w-auto">
                Comité éditorial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Directives;
