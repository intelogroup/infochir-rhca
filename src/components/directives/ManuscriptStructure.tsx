import { DirectiveSection, ChecklistItem } from "./DirectiveSection";

export const ManuscriptStructure = () => {
  return (
    <DirectiveSection title="Structure du manuscrit">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-secondary mb-4">Éléments essentiels</h3>
          <ul className="space-y-3 text-gray-600">
            <ChecklistItem text="Abstract (max 250 mots)" />
            <ChecklistItem text="3-5 mots clés (Index Medicus)" />
            <ChecklistItem text="Introduction, Matériel et méthodes, Résultats, Discussion, Conclusion" />
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-secondary mb-4">Composantes du titre</h3>
          <ul className="space-y-3 text-gray-600">
            <ChecklistItem text="Titre concis mais informatif" />
            <ChecklistItem text="Nom et prénom des auteurs avec degré académique" />
            <ChecklistItem text="Département ou Institution" />
          </ul>
        </div>
      </div>
    </DirectiveSection>
  );
};