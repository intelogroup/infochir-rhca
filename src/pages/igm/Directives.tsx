import { MainLayout } from "@/components/layouts/MainLayout";
import { DirectivesHeader } from "@/components/directives/DirectivesHeader";
import { DirectiveSection, ChecklistItem } from "@/components/directives/DirectiveSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const IGMDirectives = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DirectivesHeader 
          title="Guide pour les auteurs IGM"
          description="L'IGM d'info CHIR reçoit l'envoi d'articles à caractère clinique, expérimental, culturel, social et historique pertinents avec des thèmes de santé publique."
          backLink="/igm"
          backText="Retour à IGM"
        />

        <div className="space-y-8">
          <DirectiveSection title="Rubriques de l'IGM">
            <ul className="space-y-3 text-gray-600">
              <ChecklistItem text="Lu pour vous" />
              <ChecklistItem text="Santé publique" />
              <ChecklistItem text="Actualités Intra Hospitalières" />
              <ChecklistItem text="Informations socio culturelles" />
              <ChecklistItem text="Petites annonces" />
            </ul>
          </DirectiveSection>

          <DirectiveSection title="Préparation du manuscrit">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Format du document</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Papier régulier 29x21 cm avec 2.5 cm de marge" />
                  <ChecklistItem text="Police Times New Roman, taille 12" />
                  <ChecklistItem text="Interligne double" />
                  <ChecklistItem text="Pages numérotées en haut à droite" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Composantes du titre</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Titre concis mais informatif" />
                  <ChecklistItem text="Prénom et nom des auteurs avec degré académique" />
                  <ChecklistItem text="Nom du département ou de l'Institution" />
                  <ChecklistItem text="Coordonnées de l'auteur (mail, téléphone)" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          <DirectiveSection title="Éléments complémentaires">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Tables et figures</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Tables explicatives et numérotées" />
                  <ChecklistItem text="Titre court répondant aux questions essentielles" />
                  <ChecklistItem text="Légendes clairement indiquées" />
                  <ChecklistItem text="Images et figures numérotées et citées" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Références</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Style Vancouver" />
                  <ChecklistItem text="Numérotées dans l'ordre de citation" />
                  <ChecklistItem text="Accessibles et vérifiables" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          <DirectiveSection title="Notes importantes">
            <ul className="space-y-3 text-gray-600">
              <ChecklistItem text="IGM n'est pas une tribune politique ni de propagande individuelle ou de groupe" />
              <ChecklistItem text="Toute information est sujette à vérification" />
              <ChecklistItem text="La revue des manuscrits et leur publication est gratuite jusqu'à nouvelle disposition" />
              <ChecklistItem text="Les documents peuvent être soumis sur support papier, dans une puce ou par Internet (préférable)" />
            </ul>
          </DirectiveSection>

          <div className="flex justify-center pt-8">
            <Link to="/submission">
              <Button className="bg-secondary hover:bg-secondary-light">
                Soumettre un article
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IGMDirectives;