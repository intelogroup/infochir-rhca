
import { DirectiveSection, ChecklistItem } from "./DirectiveSection";

export const GeneralGuidelines = () => {
  return (
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
  );
};
