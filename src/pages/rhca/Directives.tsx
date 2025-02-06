
import { MainLayout } from "@/components/layouts/MainLayout";
import { DirectivesHeader } from "@/components/directives/DirectivesHeader";
import { ManuscriptPreparation } from "@/components/directives/ManuscriptPreparation";
import { ManuscriptStructure } from "@/components/directives/ManuscriptStructure";
import { DirectiveSection, ChecklistItem } from "@/components/directives/DirectiveSection";
import { Button } from "@/components/ui/button";

const RHCADirectives = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DirectivesHeader />

        <div className="space-y-8">
          <ManuscriptPreparation />
          <ManuscriptStructure />

          <DirectiveSection title="Structure détaillée">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Introduction et méthodes</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Introduction informant du problème et des trouvailles" />
                  <ChecklistItem text="Objectifs clairement établis" />
                  <ChecklistItem text="Procédures cliniques et techniques détaillées" />
                  <ChecklistItem text="Méthodologie expérimentale précise" />
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-4">Résultats et discussion</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Description des résultats sans commentaires" />
                  <ChecklistItem text="Discussion mettant en relation avec d'autres études" />
                  <ChecklistItem text="Arguments bien fondés" />
                  <ChecklistItem text="Conclusion précisant les retombées pratiques" />
                </ul>
              </div>
            </div>
          </DirectiveSection>

          <DirectiveSection title="Éléments complémentaires">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">Tables et figures</h3>
                <ul className="space-y-3 text-gray-600">
                  <ChecklistItem text="Tables numérotées avec titre explicatif" />
                  <ChecklistItem text="Figures numérotées et citées dans le texte" />
                  <ChecklistItem text="Légendes clairement indiquées" />
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

          <DirectiveSection title="Check-list de soumission">
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3 text-gray-600">
                <ChecklistItem text="Lettre de soumission à Info CHIR" />
                <ChecklistItem text="Déclaration de l'auteur (pas de conflit d'intérêt)" />
                <ChecklistItem text="Références complètes des auteurs" />
                <ChecklistItem text="Approbation éthique (si nécessaire)" />
              </ul>
              <ul className="space-y-3 text-gray-600">
                <ChecklistItem text="Abstract et mots clés" />
                <ChecklistItem text="Tables et illustrations" />
                <ChecklistItem text="Autorisations nécessaires" />
                <ChecklistItem text="Copies du texte (format papier et/ou numérique)" />
              </ul>
            </div>
          </DirectiveSection>

          <div className="flex justify-center pt-8">
            <Button 
              className="bg-secondary hover:bg-secondary-light"
              onClick={() => window.location.href = '/submission'}
            >
              Soumettre un manuscrit
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RHCADirectives;
