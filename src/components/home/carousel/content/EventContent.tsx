import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface EventContentProps {
  date: string;
  description?: string;
}

export const EventContent = ({ date, description }: EventContentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Calendar className="h-5 w-5" />
        <span className="font-medium">Détails de l'événement</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <h4 className="font-medium">Horaire</h4>
            <p className="text-sm text-gray-600">
              {date} - Durée estimée: 2 heures
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <h4 className="font-medium">Lieu</h4>
            <p className="text-sm text-gray-600">
              Centre de Conférences Médical<br />
              123 Avenue de la Médecine, Paris
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Users className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <h4 className="font-medium">Participants</h4>
            <p className="text-sm text-gray-600">
              Limité à 150 participants<br />
              Ouvert aux professionnels de santé
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Programme</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Accueil et introduction</li>
          <li>Présentations principales</li>
          <li>Sessions interactives</li>
          <li>Networking et conclusion</li>
        </ul>
      </div>
    </div>
  );
};