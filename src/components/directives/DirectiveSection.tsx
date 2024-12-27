import { CheckCircle } from "lucide-react";

interface DirectiveSectionProps {
  title: string;
  children: React.ReactNode;
}

export const DirectiveSection = ({ title, children }: DirectiveSectionProps) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold text-secondary mb-6">
        {title}
      </h2>
      {children}
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