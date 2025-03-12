
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  backLink?: string;
  icon?: React.ReactNode;
}

export const PageHeader = ({ title, description, subtitle, backLink, icon }: PageHeaderProps) => {
  return (
    <div className="mb-8">
      {backLink && (
        <Link to={backLink} className="inline-block mb-4">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
      )}
      <div className="flex items-center gap-4 mb-2">
        {icon && <div className="h-10 w-10">{icon}</div>}
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-lg font-medium text-gray-700">{subtitle}</p>
      )}
      {description && (
        <p className="text-lg text-gray-600">{description}</p>
      )}
    </div>
  );
};
