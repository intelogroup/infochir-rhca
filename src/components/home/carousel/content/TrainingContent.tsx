import { Users } from "lucide-react";

export const TrainingContent = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Users className="h-5 w-5" />
        <span className="font-medium">Détails de la formation</span>
      </div>
      <div className="space-y-3">
        <div>
          <h4 className="font-medium">Objectifs pédagogiques</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
            <li>Maîtriser les techniques avancées</li>
            <li>Développer des compétences pratiques</li>
            <li>Comprendre les applications cliniques</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Public cible</h4>
          <p className="text-sm text-gray-600 mt-1">
            Chirurgiens expérimentés souhaitant approfondir leurs compétences
          </p>
        </div>
        <div>
          <h4 className="font-medium">Prérequis</h4>
          <p className="text-sm text-gray-600 mt-1">
            Minimum 3 ans d'expérience en chirurgie
          </p>
        </div>
        <div>
          <h4 className="font-medium">Modalités</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
            <li>12 heures de formation</li>
            <li>Groupes de 10 participants maximum</li>
            <li>Exercices pratiques sur simulateur</li>
          </ul>
        </div>
      </div>
    </div>
  );
};