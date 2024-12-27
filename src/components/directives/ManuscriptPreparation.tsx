import { DirectiveSection, ChecklistItem } from "./DirectiveSection";

export const ManuscriptPreparation = () => {
  return (
    <DirectiveSection title="Préparation du manuscrit">
      <div className="grid md:grid-cols-2 gap-6">
        <ul className="space-y-3 text-gray-600">
          <ChecklistItem text="Format papier 29x21 cm, marges de 2.5 cm" />
          <ChecklistItem text="Police Times New Roman, taille 12, interligne double" />
          <ChecklistItem text="Pages numérotées en haut à droite" />
        </ul>
      </div>
    </DirectiveSection>
  );
};