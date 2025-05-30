
import { DirectiveSection, ChecklistItem } from "./DirectiveSection";

export const ReviewProcess = () => {
  return (
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
  );
};
