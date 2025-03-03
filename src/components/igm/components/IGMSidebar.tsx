import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Send, Users, Info, Newspaper } from "lucide-react";

interface SidebarCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "secondary" | "outline";
  buttonClassName?: string;
  buttonLink?: string;
}

export const IGMSidebar = () => {
  return (
    <div className="space-y-4">
      <SidebarCard
        icon={<Users className="h-5 w-5 text-primary" />}
        title="Comité éditorial"
        description="Découvrez les membres du comité éditorial de l'Info Gazette Médicale."
        buttonText="Voir le comité"
        buttonVariant="default"
        buttonLink="/igm/editorial-committee"
      />

      <SidebarCard
        icon={<FileText className="h-5 w-5 text-primary" />}
        title="Directives aux auteurs"
        description="Consultez nos directives pour la soumission d'articles et la préparation des manuscrits."
        buttonText="Voir les directives"
        buttonVariant="outline"
        buttonLink="/igm/directives"
      />

      <SidebarCard
        icon={<Send className="h-5 w-5 text-primary" />}
        title="Soumettre un article"
        description="Vous souhaitez publier dans l'IGM ? Soumettez votre article en suivant nos directives."
        buttonText="Soumettre un article"
        buttonVariant="outline"
        buttonLink="/submission"
      />

      <SidebarCard
        icon={<Info className="h-5 w-5 text-primary" />}
        title="À propos"
        description="En savoir plus sur la mission et l'histoire de l'Info Gazette Médicale."
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
}: SidebarCardProps) => {
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
      {buttonLink ? (
        <Link to={buttonLink}>{ButtonContent}</Link>
      ) : (
        ButtonContent
      )}
    </div>
  );
};
