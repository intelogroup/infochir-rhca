import { Button } from "@/components/ui/button";

export const Sidebar = () => (
  <div className="space-y-6">
    <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recherche Avancée
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Utilisez notre moteur de recherche avancé pour trouver des cas spécifiques par pathologie, spécialité ou symptômes.
      </p>
      <Button className="w-full">
        Lancer une recherche
      </Button>
    </div>

    <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Spécialités
      </h2>
      <ul className="space-y-2 text-sm">
        <li className="text-gray-600">Radiologie</li>
        <li className="text-gray-600">Cardiologie</li>
        <li className="text-gray-600">Neurologie</li>
        <li className="text-gray-600">Orthopédie</li>
        <li className="text-gray-600">Pneumologie</li>
      </ul>
    </div>

    <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Contribution
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Partagez vos cas cliniques avec la communauté médicale et contribuez à l'enrichissement de notre base de données.
      </p>
      <Button variant="outline" className="w-full">
        Soumettre un cas
      </Button>
    </div>
  </div>
);