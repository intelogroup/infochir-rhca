
import { CheckCircle } from "lucide-react";

interface DirectiveSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const DirectiveSection = ({ title, children, icon }: DirectiveSectionProps) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-green-400 to-secondary"></div>
      
      <div className="flex items-start gap-4">
        {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-secondary mb-4">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

interface ChecklistItemProps {
  text: string;
  icon?: React.ReactNode;
}

export const ChecklistItem = ({ text, icon = <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" /> }: ChecklistItemProps) => {
  return (
    <li className="flex items-start gap-3">
      {icon}
      <span>{text}</span>
    </li>
  );
};
