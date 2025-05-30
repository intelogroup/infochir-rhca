
import { MainLayout } from "@/components/layouts/MainLayout";
import { DirectivesHeader } from "@/components/directives/DirectivesHeader";
import { DirectiveSection, ChecklistItem } from "@/components/directives/DirectiveSection";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, BookOpen, FileText, Users, AlertTriangle } from "lucide-react";

const IGMDirectives = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DirectivesHeader 
          title="Guide pour les auteurs IGM"
          description="L'Info Gazette Médicale (IGM) d'Info CHIR reçoit l'envoi d'articles à caractère clinique, expérimental, culturel, social et historique pertinents avec des thèmes de santé publique."
          backLink="/igm"
          backText="Retour à IGM"
        />

        <div className="space-y-8">
          {/* Contact Information */}
          <DirectiveSection title="Informations de contact" icon={<Users className="h-6 w-6 text-secondary" />}>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-secondary mb-4">Coordonnées Info CHIR</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-medium">Adresse</p>
                        <p className="text-gray-600">30 Rue Camille Léon<br />Port-au-Prince, HAITI</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-medium">Téléphones</p>
                        <p className="text-gray-600">
                          <a href="tel:+50947355350" className="text-secondary hover:underline">+509 47355350</a> | 
                          <a href="tel:+50934013422" className="text-secondary hover:underline ml-1">+509 34013422</a>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a href="mailto:infochir@gmail.com" className="text-secondary hover:underline">
                          infochir@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary mb-4">Modalités de soumission</h3>
                  <ul className="space-y-2 text-gray-600">
                    <ChecklistItem text="Soumission par papier, clé USB ou Internet (préférable)" />
                    <ChecklistItem text="Révision et publication actuellement gratuites" />
                    <ChecklistItem text="Pour articles scientifiques: voir recommandations RHCA" />
                  </ul>
                </div>
              </div>
            </div>
          </DirectiveSection>

          {/* IGM Sections */}
          <DirectiveSection title="Rubriques de l'IGM" icon={<BookOpen className="h-6 w-6 text-secondary" />}>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3 text-gray-600">
                <ChecklistItem text="Lu pour vous" />
                <ChecklistItem text="Santé publique" />
                <ChecklistItem text="Actualités Intra Hospitalières" />
              </ul>
              <ul className="space-y-3 text-gray-600">
                <ChecklistItem text="Informations socio culturelles" />
                <ChecklistItem text="Petites annonces" />
              </ul>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                L'IGM accepte des articles à caractère clinique, expérimental, culturel, social et historique 
                pertinents avec des thèmes de santé publique.
              </p>
            </div>
          </DirectiveSection>

          {/* Manuscript Preparation */}
          <DirectiveSection title="Préparation du manuscrit">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Format général</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Papier régulier 29x21 cm, marges de 2.5 cm" />
                  <ChecklistItem text="Police Times New Roman, taille 12" />
                  <ChecklistItem text="Interligne double" />
                  <ChecklistItem text="Sections de texte clairement indiquées" />
                  <ChecklistItem text="Pages numérotées en haut à droite" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Titre et composantes</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Titre concis mais informatif" />
                  <ChecklistItem text="Prénom, nom et plus haut diplôme académique de chaque auteur" />
                  <ChecklistItem text="Nom du département ou de l'institution" />
                  <ChecklistItem text="Nom, adresse, email et téléphone de l'auteur correspondant" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          {/* References */}
          <DirectiveSection title="Références bibliographiques">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Style et format</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Style Vancouver obligatoire" />
                  <ChecklistItem text="Numérotées dans l'ordre d'apparition dans le texte" />
                  <ChecklistItem text="Identifiées par des chiffres arabes" />
                  <ChecklistItem text="Abréviations selon l'Index Medicus" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Exigences</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Références accessibles et vérifiables" />
                  <ChecklistItem text="Noms d'auteurs selon l'Index Medicus" />
                  <ChecklistItem text="Titres de journaux abrégés" />
                  <ChecklistItem text="Données complètes de publication" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          {/* Tables and Figures */}
          <DirectiveSection title="Tableaux et figures">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Tableaux</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Doivent être explicatifs et numérotés" />
                  <ChecklistItem text="Titre court répondant à: Qui? Quoi? Quand? Où? Comment?" />
                  <ChecklistItem text="Titre placé au-dessus du tableau" />
                  <ChecklistItem text="Légendes clairement indiquées" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Images et figures</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Traitement identique aux tableaux" />
                  <ChecklistItem text="Doivent être numérotées et citées dans le texte" />
                  <ChecklistItem text="Légendes clairement indiquées en dessous" />
                  <ChecklistItem text="Qualité suffisante pour reproduction" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          {/* Author Declaration and Ethics */}
          <DirectiveSection title="Déclaration des auteurs et éthique">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Déclaration obligatoire</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Manuscrits signés par les auteurs" />
                  <ChecklistItem text="Déclaration d'absence de conflit d'intérêts" />
                  <ChecklistItem text="Confirmation de l'originalité de l'article" />
                  <ChecklistItem text="Article non soumis à d'autres revues" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Droits d'auteur et autorisations</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Autorisation écrite pour reproduction de textes/illustrations non originaux" />
                  <ChecklistItem text="Approbation des autorités compétentes pour recherche humaine/animale" />
                  <ChecklistItem text="Respect des droits d'auteur" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          {/* Submission Checklist */}
          <DirectiveSection title="Check-list de soumission" icon={<FileText className="h-6 w-6 text-secondary" />}>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-secondary mb-4">Documents requis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Lettre de soumission à Info CHIR" />
                  <ChecklistItem text="Déclaration de l'auteur" />
                  <ChecklistItem text="Références complètes des auteurs" />
                  <ChecklistItem text="Copies du texte avec tous ses composants" />
                </ul>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Abstract et mots-clés (si nécessaire)" />
                  <ChecklistItem text="Tableaux et illustrations" />
                  <ChecklistItem text="Références bibliographiques" />
                  <ChecklistItem text="Autorisations nécessaires" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          {/* Important Notes */}
          <DirectiveSection title="Notes importantes" icon={<AlertTriangle className="h-6 w-6 text-secondary" />}>
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <ul className="space-y-3 text-gray-700">
                <ChecklistItem text="Les règlements sont sujets à modification" />
                <ChecklistItem text="L'IGM n'est pas une tribune politique ni de propagande individuelle ou de groupe" />
                <ChecklistItem text="Toute information est sujette à vérification" />
                <ChecklistItem text="La revue des manuscrits et leur publication est gratuite jusqu'à nouvelle disposition" />
                <ChecklistItem text="Les documents peuvent être soumis sur support papier, dans une clé USB ou par Internet (préférable)" />
              </ul>
            </div>
          </DirectiveSection>

          <div className="flex justify-center pt-8">
            <Button 
              className="bg-secondary hover:bg-secondary-light"
              onClick={() => window.location.href = '/submission'}
            >
              Soumettre un article IGM
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IGMDirectives;
