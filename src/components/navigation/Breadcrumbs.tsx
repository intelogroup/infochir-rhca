
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Fil d'ariane" className="flex items-center space-x-1 text-sm text-gray-500">
      <Link
        to="/"
        className="flex items-center hover:text-primary transition-colors p-1 rounded"
        aria-label="Accueil"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link
              to={item.href}
              className="hover:text-primary transition-colors px-1 py-0.5 rounded text-gray-600 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium px-1">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
