import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const IGMSidebar = () => {
  return (
    <div className="space-y-4 order-first lg:order-none">
      <SidebarCard
        icon={<BookOpen className="h-5 w-5" />}
        title="Soumission d'articles"
        description="Nous accueillons les articles originaux, les revues systématiques, les cas cliniques et les lettres à l'éditeur."
        buttonText="Soumettre un manuscrit"
        buttonVariant="default"
        buttonClassName="bg-ocean hover:bg-ocean-hover"
      />

      <SidebarCard
        icon={<MessageCircle className="h-5 w-5" />}
        title="Instructions aux auteurs"
        description="Consultez nos directives détaillées pour la préparation et la soumission de votre manuscrit."
        buttonText="Voir les directives"
        buttonVariant="outline"
        buttonClassName="text-ocean hover:bg-ocean hover:text-white border-ocean"
      />

      <SidebarCard
        icon={<Users className="h-5 w-5" />}
        title="Comité éditorial"
        description="Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs."
        buttonText="Découvrir l'équipe"
        buttonVariant="outline"
        buttonClassName="text-ocean hover:bg-ocean hover:text-white border-ocean"
        buttonLink="/igm/editorial-committee"
      />
    </div>
  );
};

interface SidebarCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  buttonClassName?: string;
  buttonLink?: string;
}

const SidebarCard = ({
  icon,
  title,
  description,
  buttonText,
  buttonVariant = "default",
  buttonClassName = "",
  buttonLink,
}: SidebarCardProps) => {
  const ButtonWrapper = buttonLink ? Link : "div";
  const buttonProps = buttonLink ? { to: buttonLink } : {};

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {description}
      </p>
      <ButtonWrapper {...buttonProps}>
        <Button 
          variant={buttonVariant} 
          className={`w-full ${buttonClassName}`}
        >
          {buttonText}
        </Button>
      </ButtonWrapper>
    </div>
  );
};