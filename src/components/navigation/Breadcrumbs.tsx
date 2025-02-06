
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const handleNavigation = (href?: string) => {
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <nav aria-label="Fil d'ariane" className="flex items-center space-x-1 text-sm text-gray-500">
      <button
        onClick={() => handleNavigation('/')}
        className="flex items-center hover:text-primary transition-colors"
        aria-label="Accueil"
      >
        <Home className="h-4 w-4" />
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.href ? (
            <button
              onClick={() => handleNavigation(item.href)}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
