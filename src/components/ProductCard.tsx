import { LucideIcon } from "lucide-react";

interface ProductCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const ProductCard = ({ title, description, icon: Icon, href }: ProductCardProps) => {
  return (
    <a
      href={href}
      className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
    >
      <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
        <Icon className="text-primary h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </a>
  );
};