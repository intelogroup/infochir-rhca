import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import { DirectivesHeader } from "@/components/directives/DirectivesHeader";
import { ManuscriptPreparation } from "@/components/directives/ManuscriptPreparation";
import { ManuscriptStructure } from "@/components/directives/ManuscriptStructure";
import { AlertCircle } from "lucide-react";
import { DirectiveSection, ChecklistItem } from "@/components/directives/DirectiveSection";

const Directives = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DirectivesHeader />

        <div className="space-y-8">
          <ManuscriptPreparation />
          <ManuscriptStructure />

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

          <DirectiveSection title="Notes importantes">
            <ul className="space-y-3 text-gray-600">
              <ChecklistItem 
                text="La revue des manuscrits et leur publication est gratuite jusqu'à nouvelle disposition"
                icon={<AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />}
              />
              <ChecklistItem 
                text="Les documents peuvent être soumis sur support papier, dans une puce ou par Internet (préférable)"
                icon={<AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />}
              />
              <ChecklistItem 
                text="Règlementation sujette à modification"
                icon={<AlertCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />}
              />
            </ul>
          </DirectiveSection>
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