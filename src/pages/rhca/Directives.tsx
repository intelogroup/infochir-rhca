
import { MainLayout } from "@/components/layouts/MainLayout";
import { DirectivesHeader } from "@/components/directives/DirectivesHeader";
import { DirectiveSection, ChecklistItem } from "@/components/directives/DirectiveSection";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, BookOpen, FileText, Users } from "lucide-react";

const RHCADirectives = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DirectivesHeader 
          title="Guide pour les auteurs RHCA"
          description="La RHCA d'Info CHIR reçoit l'envoi d'articles à caractère clinique, expérimental, culturel, historique pertinents avec des thèmes chirurgicaux et anesthésiologiques. Les directives suivent les 'Uniform requirements for manuscripts submitted to Biomedical Journals, JAMA 1997; 277: 927-934'."
          backLink="/rhca"
          backText="Retour à RHCA"
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
                    <ChecklistItem text="Réponse sous 2-4 semaines" />
                  </ul>
                </div>
              </div>
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

          {/* Manuscript Structure */}
          <DirectiveSection title="Structure détaillée du manuscrit">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Abstract et mots-clés</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Abstract: maximum 250 mots" />
                  <ChecklistItem text="Doit inclure: problème, matériels et méthodes, résultats, conclusion" />
                  <ChecklistItem text="Accent sur l'originalité de l'étude ou observation" />
                  <ChecklistItem text="3 à 5 mots-clés correspondant à l'Index Medicus" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Introduction et objectifs</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Informer du problème et des trouvailles d'autres auteurs" />
                  <ChecklistItem text="Établir distinctement la nature et l'objectif du travail" />
                  <ChecklistItem text="Référencer les études pertinentes" />
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Matériel et méthodes</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Expliquer clairement et précisément les procédures" />
                  <ChecklistItem text="Détailler les techniques cliniques et expérimentales" />
                  <ChecklistItem text="Permettre la reproductibilité de l'étude" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Résultats et discussion</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Décrire les résultats sans commentaires" />
                  <ChecklistItem text="Inclure tableaux, graphiques et figures" />
                  <ChecklistItem text="Commenter et relier aux résultats d'autres auteurs" />
                  <ChecklistItem text="Arguments bien fondés et pertinents" />
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
                <h3 className="font-semibold text-secondary mb-4">Figures</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Traitement identique aux tableaux" />
                  <ChecklistItem text="Doivent être numérotées et citées dans le texte" />
                  <ChecklistItem text="Légendes clairement indiquées en dessous" />
                  <ChecklistItem text="Qualité suffisante pour reproduction" />
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
                  <ChecklistItem text="Numérotées dans l'ordre de citation" />
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

          {/* Ethical Requirements */}
          <DirectiveSection title="Approbation éthique et consentement">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Déclaration des auteurs</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Manuscrits signés par les auteurs" />
                  <ChecklistItem text="Déclaration d'absence de conflit d'intérêts" />
                  <ChecklistItem text="Confirmation de l'originalité de l'article" />
                  <ChecklistItem text="Article non soumis à d'autres revues" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Autorisations requises</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Approbation des autorités compétentes pour recherche humaine/animale" />
                  <ChecklistItem text="Autorisation écrite pour reproduction de textes/illustrations" />
                  <ChecklistItem text="Consentement des patients si applicable" />
                  <ChecklistItem text="Droits d'auteur respectés" />
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
                  <ChecklistItem text="Copies du texte (papier et/ou numérique)" />
                </ul>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Abstract et mots-clés" />
                  <ChecklistItem text="Tableaux et illustrations" />
                  <ChecklistItem text="Références bibliographiques" />
                  <ChecklistItem text="Autorisations nécessaires" />
                </ul>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note importante:</strong> Les règlements sont sujets à modification. 
                  Vérifiez toujours les dernières directives avant soumission.
                </p>
              </div>
            </div>
          </DirectiveSection>

          <div className="flex justify-center pt-8">
            <Button 
              className="bg-secondary hover:bg-secondary-light"
              onClick={() => window.location.href = '/submission'}
            >
              Soumettre un manuscrit RHCA
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RHCADirectives;
