
import { DirectiveSection, ChecklistItem } from "./DirectiveSection";

export const ManuscriptPreparation = () => {
  return (
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
  );
};
