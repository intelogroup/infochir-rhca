
import React from 'react';
import { FileText, Send, Users, Info, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AtlasTableOfContents } from './AtlasTableOfContents';

interface SidebarCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "secondary" | "outline";
  buttonClassName?: string;
  buttonLink?: string;
}

export const AtlasSidebar = () => {
  return (
    <div className="space-y-4">
      <SidebarCard
        icon={<BookOpen className="h-5 w-5 text-primary" />}
        title="Table des matières"
        description="Consultez la liste complète des chapitres disponibles dans l'Atlas."
        buttonText="Voir la table des matières"
        buttonVariant="default"
        buttonClassName="mt-2"
        buttonLink="#"
        customContent={<AtlasTableOfContents />}
      />

      <SidebarCard
        icon={<FileText className="h-5 w-5 text-primary" />}
        title="Directives aux auteurs"
        description="Consultez nos directives pour la soumission de chapitres et la préparation des manuscrits."
        buttonText="Voir les directives"
        buttonVariant="outline"
        buttonLink="/atlas/directives"
      />

      <SidebarCard
        icon={<Send className="h-5 w-5 text-primary" />}
        title="Soumettre un chapitre"
        description="Vous souhaitez contribuer à l'Atlas ? Soumettez votre chapitre en suivant nos directives."
        buttonText="Soumettre un chapitre"
        buttonVariant="outline"
        buttonLink="/submission"
      />

      <SidebarCard
        icon={<Users className="h-5 w-5 text-primary" />}
        title="Comité éditorial"
        description="Découvrez l'équipe éditoriale de l'Atlas et son processus de révision."
        buttonText="Voir le comité"
        buttonVariant="outline"
        buttonLink="/editorial-committee"
      />

      <SidebarCard
        icon={<Info className="h-5 w-5 text-primary" />}
        title="À propos"
        description="En savoir plus sur la mission et l'histoire de l'Atlas des Décisions Cliniques."
        buttonText="En savoir plus"
        buttonVariant="outline"
        buttonLink="/about"
      />
    </div>
  );
};

const SidebarCard = ({
  icon,
  title,
  description,
  buttonText,
  buttonVariant = "default",
  buttonClassName = "",
  buttonLink,
  customContent
}: SidebarCardProps & { customContent?: React.ReactNode }) => {
  const ButtonContent = (
    <Button 
      variant={buttonVariant} 
      className={`w-full ${buttonClassName}`}
    >
      {buttonText}
    </Button>
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {description}
      </p>
      {customContent}
      {!customContent && buttonLink && (
        <Link to={buttonLink}>{ButtonContent}</Link>
      )}
      {!customContent && !buttonLink && ButtonContent}
    </div>
  );
};

export default AtlasSidebar;
